import {
  hashPassword,
  verifyPassword,
  randomToken,
  randomMfaCode,
  sha256Hex,
} from "./crypto.js";
import * as db from "./db.js";
import { sendMfaCodeEmail } from "./mail.js";

const SESSION_COOKIE = "fontory_session";
const LOCK_THRESHOLD = 5; // 5회 실패 시 잠금
const LOCK_MINUTES = 15;
const MFA_MAX_PER_WINDOW = 5; // 15분당 최대 재발송 횟수
const MFA_RATE_WINDOW_MS = 15 * 60_000;

function cors(env, extraHeaders = {}) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    ...extraHeaders,
  };
}

function json(env, data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors(env, extraHeaders) },
  });
}

function badRequest(env, message) {
  return json(env, { error: message }, 400);
}
function unauthorized(env, message = "인증이 필요합니다.") {
  return json(env, { error: message }, 401);
}
function forbidden(env, message = "권한이 없습니다.") {
  return json(env, { error: message }, 403);
}
function notFound(env, message = "찾을 수 없습니다.") {
  return json(env, { error: message }, 404);
}

function setCookie(name, value, maxAgeSeconds) {
  // 프론트엔드(softronics.run.place)와 API(*.workers.dev)가 서로 다른 도메인이므로
  // 크로스 사이트 쿠키 전송을 위해 SameSite=None; Secure 필요.
  // 일부 브라우저의 서드파티 쿠키 차단 정책 영향을 받을 수 있음(README 참고).
  const attrs = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=None",
    maxAgeSeconds != null ? `Max-Age=${maxAgeSeconds}` : "",
  ].filter(Boolean);
  return attrs.join("; ");
}

function clearCookie(name) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function requireSession(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const session = await db.getValidSessionByTokenHash(env.DB, tokenHash);
  if (!session) return null;
  const account = await db.getAccountById(env.DB, session.account_id);
  if (!account || account.disabled) return null;
  return { session, account };
}

function isValidUsername(u) {
  return typeof u === "string" && /^[a-zA-Z0-9_.-]{3,32}$/.test(u);
}
function isValidPassword(p) {
  return typeof p === "string" && p.length >= 8 && p.length <= 256;
}
function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------------- 라우트 핸들러 ----------------

async function handleLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body;
  if (!isValidUsername(username) || typeof password !== "string" || !password) {
    return badRequest(env, "아이디 또는 비밀번호 형식이 올바르지 않습니다.");
  }

  const account = await db.getAccountByUsername(env.DB, username);
  // 계정 존재 여부를 노출하지 않기 위해 동일한 오류 메시지 사용
  const genericFail = () => unauthorized(env, "아이디 또는 비밀번호가 올바르지 않습니다.");

  if (!account) return genericFail();
  if (account.disabled) return forbidden(env, "중지된 계정입니다.");
  if (account.locked_until && account.locked_until > Date.now()) {
    return json(env, { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요." }, 429);
  }

  const ok = await verifyPassword(password, account.password_hash);
  if (!ok) {
    await db.recordFailedLogin(env.DB, account.id, LOCK_THRESHOLD, LOCK_MINUTES);
    return genericFail();
  }
  await db.resetFailedLogins(env.DB, account.id);

  const mfaRequired =
    account.mfa_enabled === 1 ||
    (account.role === "admin" && String(env.MFA_REQUIRED_FOR_ADMIN).toLowerCase() === "true");

  if (mfaRequired) {
    if (!account.email) {
      // 이메일이 없으면 MFA를 강제할 수 없으므로 관리자에게 알리고 로그인 차단
      return json(env, { error: "MFA가 필요하지만 계정에 이메일이 등록되어 있지 않습니다. 관리자에게 문의하세요." }, 400);
    }
    const since = Date.now() - MFA_RATE_WINDOW_MS;
    const recent = await db.countRecentMfaCodes(env.DB, account.id, since);
    if (recent >= MFA_MAX_PER_WINDOW) {
      return json(env, { error: "인증 코드 요청이 너무 많습니다. 잠시 후 다시 시도하세요." }, 429);
    }
    const code = randomMfaCode();
    const codeHash = await sha256Hex(code);
    await db.createMfaCode(env.DB, account.id, codeHash, parseInt(env.MFA_TTL_MINUTES || "5", 10));

    const pendingToken = randomToken(24);
    const pendingHash = await sha256Hex(pendingToken);
    await db.createMfaPending(env.DB, account.id, pendingHash, parseInt(env.MFA_TTL_MINUTES || "5", 10));

    try {
      await sendMfaCodeEmail(env, account.email, code);
    } catch (e) {
      // 내부 SMTP 오류 세부정보는 운영 응답에 노출하지 않는다.
      console.error("MFA email delivery failed:", e && e.message ? e.message : String(e));
      return json(env, { error: "인증 코드 이메일 발송에 실패했습니다." }, 502);
    }

    return json(env, { mfaRequired: true, pendingToken });
  }

  return await issueSession(env, account);
}

async function issueSession(env, account) {
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const ttl = parseInt(env.SESSION_TTL_MINUTES || "1440", 10);
  await db.createSession(env.DB, account.id, tokenHash, ttl);
  return json(
    env,
    { username: account.username, role: account.role, status: account.status },
    200,
    { "Set-Cookie": setCookie(SESSION_COOKIE, token, ttl * 60) }
  );
}

async function handleMfaVerify(request, env) {
  const body = await request.json().catch(() => ({}));
  const { pendingToken, code } = body;
  if (typeof pendingToken !== "string" || typeof code !== "string") {
    return badRequest(env, "요청 형식이 올바르지 않습니다.");
  }
  const pendingHash = await sha256Hex(pendingToken);
  const pending = await db.getValidMfaPending(env.DB, pendingHash);
  if (!pending) return unauthorized(env, "인증 요청이 만료되었거나 유효하지 않습니다.");

  const mfa = await db.getLatestActiveMfaCode(env.DB, pending.account_id);
  if (!mfa) return unauthorized(env, "인증 코드가 만료되었습니다. 다시 로그인해주세요.");
  if (mfa.attempts >= 5) return unauthorized(env, "인증 시도 횟수를 초과했습니다. 다시 로그인해주세요.");

  const codeHash = await sha256Hex(code);
  if (codeHash !== mfa.code_hash) {
    await db.incrementMfaAttempts(env.DB, mfa.id);
    return unauthorized(env, "인증 코드가 올바르지 않습니다.");
  }

  await db.markMfaCodeUsed(env.DB, mfa.id);
  await db.deleteMfaPending(env.DB, pending.id);

  const account = await db.getAccountById(env.DB, pending.account_id);
  if (!account || account.disabled) return forbidden(env, "중지된 계정입니다.");
  return await issueSession(env, account);
}

async function handleLogout(request, env) {
  const token = getCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await sha256Hex(token);
    await db.revokeSessionByTokenHash(env.DB, tokenHash);
  }
  return json(env, { ok: true }, 200, { "Set-Cookie": clearCookie(SESSION_COOKIE) });
}

async function handleMe(request, env) {
  const auth = await requireSession(request, env);
  if (!auth) return unauthorized(env);
  const { account } = auth;
  return json(env, { username: account.username, role: account.role, status: account.status, email: account.email || null });
}

async function handleUpdateOwnEmail(request, env) {
  const auth = await requireSession(request, env);
  if (!auth) return unauthorized(env);
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email && !isValidEmail(email)) return badRequest(env, "이메일 형식이 올바르지 않습니다.");
  await db.updateAccountEmail(env.DB, auth.account.id, email || null);
  return json(env, { ok: true, email: email || null });
}

async function requireAdmin(request, env) {
  const auth = await requireSession(request, env);
  if (!auth) return { error: unauthorized(env) };
  if (auth.account.role !== "admin") return { error: forbidden(env) };
  return { auth };
}

async function handleListAccounts(request, env) {
  const { error, auth } = await requireAdmin(request, env);
  if (error) return error;
  const accounts = await db.listAccounts(env.DB);
  return json(env, { accounts });
}

async function handleCreateAccount(request, env) {
  const { error, auth } = await requireAdmin(request, env);
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  const { username, password, role, email } = body;

  if (!isValidUsername(username)) return badRequest(env, "아이디 형식이 올바르지 않습니다. (영문/숫자/._- 3~32자)");
  if (!isValidPassword(password)) return badRequest(env, "비밀번호는 8자 이상이어야 합니다.");
  if (role && role !== "admin" && role !== "user") return badRequest(env, "role은 admin 또는 user만 가능합니다.");

  const existing = await db.getAccountByUsername(env.DB, username);
  if (existing) return json(env, { error: "이미 존재하는 아이디입니다." }, 409);

  const passwordHash = await hashPassword(password);
  await db.createAccount(env.DB, { username, passwordHash, role: role || "user", email });
  return json(env, { username, role: role || "user", status: "managed" }, 201);
}

async function handleChangePassword(request, env, username) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  const { password } = body;
  if (!isValidPassword(password)) return badRequest(env, "비밀번호는 8자 이상이어야 합니다.");

  const account = await db.getAccountByUsername(env.DB, username);
  if (!account) return notFound(env, "계정을 찾을 수 없습니다.");

  const passwordHash = await hashPassword(password);
  await db.updatePasswordHash(env.DB, username, passwordHash);
  return json(env, { ok: true });
}

async function handleDisableAccount(request, env, username) {
  const { error, auth } = await requireAdmin(request, env);
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  const disabled = body.disabled !== false; // 기본값 true(중지)

  const account = await db.getAccountByUsername(env.DB, username);
  if (!account) return notFound(env, "계정을 찾을 수 없습니다.");

  if (disabled && account.role === "admin") {
    const otherAdmins = await db.countAdmins(env.DB, account.id);
    if (otherAdmins === 0) {
      return badRequest(env, "마지막 관리자 계정은 중지할 수 없습니다.");
    }
  }

  await db.setDisabled(env.DB, username, disabled);
  return json(env, { username, disabled });
}

async function handleDeleteAccount(request, env, username) {
  const { error, auth } = await requireAdmin(request, env);
  if (error) return error;

  const account = await db.getAccountByUsername(env.DB, username);
  if (!account) return notFound(env, "계정을 찾을 수 없습니다.");

  if (account.id === auth.account.id) {
    return badRequest(env, "자기 자신의 관리자 계정은 삭제할 수 없습니다.");
  }
  if (account.role === "admin") {
    const otherAdmins = await db.countAdmins(env.DB, account.id);
    if (otherAdmins === 0) {
      return badRequest(env, "마지막 관리자 계정은 삭제할 수 없습니다.");
    }
  }

  await db.deleteAccountByUsername(env.DB, username);
  return json(env, { ok: true });
}

// 최초 1회 관리자 계정 시딩. SETUP_SECRET(Worker Secret)을 아는 사람만 실행 가능하며
// 이미 관리자 계정이 하나라도 있으면 거부한다(기존 데이터와 절대 충돌하지 않음).
async function handleSetupAdmin(request, env) {
  const setupSecret = request.headers.get("X-Setup-Secret");
  if (!env.SETUP_SECRET || setupSecret !== env.SETUP_SECRET) {
    return unauthorized(env, "설정 비밀값이 올바르지 않습니다.");
  }
  const existingAdmins = await db.countAdmins(env.DB);
  if (existingAdmins > 0) {
    return json(env, { error: "이미 관리자 계정이 존재합니다. 시딩을 건너뜁니다." }, 409);
  }
  const body = await request.json().catch(() => ({}));
  const { username, password, email } = body;
  if (!isValidUsername(username)) return badRequest(env, "아이디 형식이 올바르지 않습니다.");
  if (!isValidPassword(password)) return badRequest(env, "비밀번호는 8자 이상이어야 합니다.");

  const existing = await db.getAccountByUsername(env.DB, username);
  if (existing) return json(env, { error: "이미 존재하는 아이디입니다." }, 409);

  const passwordHash = await hashPassword(password);
  await db.createAccount(env.DB, { username, passwordHash, role: "admin", email });
  return json(env, { ok: true, username, role: "admin" }, 201);
}

// ---------------- 라우터 ----------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    try {
      if (pathname === "/api/auth/login" && request.method === "POST") return await handleLogin(request, env);
      if (pathname === "/api/auth/mfa/verify" && request.method === "POST") return await handleMfaVerify(request, env);
      if (pathname === "/api/auth/logout" && request.method === "POST") return await handleLogout(request, env);
      if (pathname === "/api/auth/me" && request.method === "GET") return await handleMe(request, env);
      if (pathname === "/api/account/email" && request.method === "PATCH") return await handleUpdateOwnEmail(request, env);

      if (pathname === "/api/accounts" && request.method === "GET") return await handleListAccounts(request, env);
      if (pathname === "/api/accounts" && request.method === "POST") return await handleCreateAccount(request, env);

      let m;
      if ((m = pathname.match(/^\/api\/accounts\/([^/]+)\/password$/)) && request.method === "PATCH") {
        return await handleChangePassword(request, env, decodeURIComponent(m[1]));
      }
      if ((m = pathname.match(/^\/api\/accounts\/([^/]+)\/disable$/)) && request.method === "POST") {
        return await handleDisableAccount(request, env, decodeURIComponent(m[1]));
      }
      if ((m = pathname.match(/^\/api\/accounts\/([^/]+)$/)) && request.method === "DELETE") {
        return await handleDeleteAccount(request, env, decodeURIComponent(m[1]));
      }

      if (pathname === "/api/setup/admin" && request.method === "POST") return await handleSetupAdmin(request, env);

      return notFound(env);
    } catch (err) {
      // 민감정보(비밀번호, 해시, SMTP 인증정보 등)가 오류 메시지에 섞이지 않도록 일반 메시지만 반환
      console.error("Unhandled error:", err && err.message ? err.message : String(err));
      return json(env, { error: "서버 오류가 발생했습니다." }, 500);
    }
  },
};
