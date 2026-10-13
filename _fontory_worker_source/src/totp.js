// TOTP(RFC 6238) 유틸리티 - Google Authenticator, Microsoft Authenticator, 1Password 등과 호환
// - 30초 주기, 6자리, HMAC-SHA1 (인증 앱 기본값)
// - 비밀키는 D1에 AES-GCM으로 암호화해 저장한다. 키는 Worker Secret TOTP_ENC_KEY(base64, 32바이트).

const STEP_SECONDS = 30;
const DIGITS = 6;
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(bytes) {
  let bits = 0, value = 0, out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(str) {
  const clean = String(str).toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0, value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx === -1) throw new Error("invalid base32");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

export function generateTotpSecret() {
  const bytes = new Uint8Array(20); // 160비트 (RFC 4226 권장)
  crypto.getRandomValues(bytes);
  return base32Encode(bytes);
}

export function currentStep(nowMs = Date.now()) {
  return Math.floor(nowMs / 1000 / STEP_SECONDS);
}

async function hotp(secretBytes, counter) {
  const msg = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const offset = mac[mac.length - 1] & 0x0f;
  const bin = ((mac[offset] & 0x7f) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
  return String(bin % 10 ** DIGITS).padStart(DIGITS, "0");
}

export async function totpAt(secretBase32, step) {
  return hotp(base32Decode(secretBase32), step);
}

// 앞뒤 1주기(±30초) 시계 오차를 허용한다. 일치하면 해당 step 번호, 아니면 null.
export async function verifyTotp(secretBase32, code, { window = 1, nowMs = Date.now() } = {}) {
  const typed = String(code || "").replace(/\D/g, "");
  if (typed.length !== DIGITS) return null;
  const secretBytes = base32Decode(secretBase32);
  const step = currentStep(nowMs);
  let matched = null;
  for (let w = -window; w <= window; w++) {
    const candidate = await hotp(secretBytes, step + w);
    let diff = 0;
    for (let i = 0; i < DIGITS; i++) diff |= candidate.charCodeAt(i) ^ typed.charCodeAt(i);
    if (diff === 0 && matched === null) matched = step + w;
  }
  return matched;
}

export function otpauthUri({ issuer = "Fontory", account, secret }) {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({ secret, issuer, algorithm: "SHA1", digits: String(DIGITS), period: String(STEP_SECONDS) });
  return `otpauth://totp/${label}?${params.toString()}`;
}

// ---- 비밀키 암호화 (AES-GCM) ----

function b64(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function unb64(str) {
  const s = atob(str);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

export function totpKeyConfigured(env) {
  try {
    return Boolean(env.TOTP_ENC_KEY) && unb64(env.TOTP_ENC_KEY).length === 32;
  } catch {
    return false;
  }
}

async function encKey(env) {
  if (!totpKeyConfigured(env)) throw new Error("TOTP_ENC_KEY is not configured");
  return crypto.subtle.importKey("raw", unb64(env.TOTP_ENC_KEY), "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptSecret(env, secretBase32, accountId) {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: new TextEncoder().encode(`acct:${accountId}`) },
    await encKey(env),
    new TextEncoder().encode(secretBase32)
  );
  return `v1$${b64(iv)}$${b64(new Uint8Array(ct))}`;
}

export async function decryptSecret(env, stored, accountId) {
  const [ver, ivB64, ctB64] = String(stored).split("$");
  if (ver !== "v1") throw new Error("unknown secret format");
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: unb64(ivB64), additionalData: new TextEncoder().encode(`acct:${accountId}`) },
    await encKey(env),
    unb64(ctB64)
  );
  return new TextDecoder().decode(pt);
}
