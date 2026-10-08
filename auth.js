(() => {
  const USERS = {
    "76671c0f8ca2aa9f898af7d22da44e1136ceea025348147859f59b9bc905a": { role: "admin" },
    "414cb10fdc75ee2a9853bbcf8c93c8cf3888de2e66c6a84307e1ff914ef3ffa8": { role: "user" },
    "00b0d881f3ca4cae478554efc2c5148e41f2cbd8528564c123a6ab8d8845ddc60": { role: "user" },
    "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": { role: "admin" }
  };
  const PASSWORDS = {
    "6280ab472481a292f4391e28f6f3c42c329dad577fd4afda33b2720f4a18b7f0": true,
    "40d354f5efb6114fab5a8df72caa4f836f527ad3b1d255a51dcb9f6836ae687a": true,
    "41d1fbe61da30ec3532e430faee074a6a7174332c6a07b623765a776a530bb34": true,
    "548a492529d0fa2943de0362cbc497bb252bada198526523a26739abe298d110": true
  };
  const ACCOUNTS = window.FONTORY_ACCOUNTS || {};
  const KEY = "fontory-auth-v5";
  const PASSKEY_KEY = "fontory-passkeys-v1";
  const PENDING_KEY = "fontory-auth-pending";
  const PENDING_BACKUP_KEY = "fontory-auth-pending-backup-v1";
  const MANAGED_KEY = "fontory-managed-accounts-v1";
  const PASSWORD_REMINDER_KEY = "fontory-password-reminder-v1";
  const PASSWORD_REMINDER_DAYS = 30;
  const CENTRAL_API = "https://fontory-api.fontory.workers.dev";

  const hash = async (value) => {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  const todayKst = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const dailyCode = async () => { const [year, month, day] = todayKst().split("-"); return year.slice(-2) + month + day; };
  const session = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; } };
  const readPending = () => { try { const live = sessionStorage.getItem(PENDING_KEY); if (live) return JSON.parse(live); const backup = localStorage.getItem(PENDING_BACKUP_KEY); return backup ? JSON.parse(backup) : null; } catch { return null; } };
  const writePending = (value) => { const serialized = JSON.stringify(value); sessionStorage.setItem(PENDING_KEY, serialized); try { localStorage.setItem(PENDING_BACKUP_KEY, serialized); } catch {} };
  const clearPending = () => { sessionStorage.removeItem(PENDING_KEY); try { localStorage.removeItem(PENDING_BACKUP_KEY); } catch {} };
  const rpId = () => location.hostname;
  const webauthnOk = () => window.isSecureContext && typeof window.PublicKeyCredential === "function" && typeof navigator.credentials?.create === "function";
  const toB64 = (buffer) => { const bytes = new Uint8Array(buffer); let bin = ""; bytes.forEach((b) => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); };
  const fromB64 = (value) => { const pad = "=".repeat((4 - (value.length % 4)) % 4); const raw = atob(value.replace(/-/g, "+").replace(/_/g, "/") + pad); const out = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i); return out.buffer; };
  const loadPasskeys = () => { try { const all = JSON.parse(localStorage.getItem(PASSKEY_KEY) || "[]"); return Array.isArray(all) ? all.filter((item) => item.rpId === rpId()) : []; } catch { return []; } };
  const savePasskeys = (items) => { let others = []; try { others = JSON.parse(localStorage.getItem(PASSKEY_KEY) || "[]").filter((item) => item.rpId !== rpId()); } catch {} localStorage.setItem(PASSKEY_KEY, JSON.stringify([...others, ...items])); };
  const loadManaged = () => { try { const all = JSON.parse(localStorage.getItem(MANAGED_KEY) || "[]"); return Array.isArray(all) ? all : []; } catch { return []; } };
  const saveManaged = (items) => { localStorage.setItem(MANAGED_KEY, JSON.stringify(items)); items.forEach((item) => { if (item.userHash && item.passHash) ACCOUNTS[item.userHash] = { role: item.disabled ? "disabled" : item.role, pass: item.passHash }; }); };
  saveManaged(loadManaged());
  const setError = (text) => { const error = document.querySelector("#authError"); if (error) error.textContent = text || ""; };
  const randomBytes = (size) => crypto.getRandomValues(new Uint8Array(size));
  const escapeAuth = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  async function centralFetch(path, options = {}) {
    const current = session();
    const headers = new Headers(options.headers || {});
    if (current?.token) headers.set("Authorization", "Bearer " + current.token);
    return fetch(CENTRAL_API + path, { credentials: "include", ...options, headers });
  }
  async function centralMe() {
    const response = await centralFetch("/api/auth/me");
    if (response.status === 401) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "중앙 인증 서버에 연결할 수 없습니다.");
    return data;
  }
  async function centralLogin(username, password) {
    const response = await centralFetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "아이디 또는 비밀번호가 올바르지 않습니다.");
    if (data.mfaRequired && data.pendingToken) return { username: data.username || username, role: data.role || "user", method: "server", mfaRequired: true, mfaMethods: data.mfaMethods || ["email"], pendingToken: data.pendingToken };
    return data.username ? { username: data.username, role: data.role || "user", status: data.status, passwordUpdatedAt: data.passwordUpdatedAt, token: data.token, method: "server" } : null;
  }
  async function sendCentralMfa(pendingToken) {
    const response = await centralFetch("/api/auth/mfa/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pendingToken }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "인증 코드 이메일 발송에 실패했습니다.");
  }
  async function verifyCentralDaily(pendingToken, code) {
    const response = await centralFetch("/api/auth/mfa/daily", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pendingToken, code }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "간편 코드가 올바르지 않습니다.");
    return { username: data.username || "admin", role: data.role || "admin", status: data.status, passwordUpdatedAt: data.passwordUpdatedAt, token: data.token, method: "server" };
  }
  async function verifyCentralMfa(pendingToken, code) {
    const response = await centralFetch("/api/auth/mfa/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pendingToken, code }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "인증 코드가 올바르지 않습니다.");
    return { username: data.username || "admin", role: data.role || "admin", status: data.status, passwordUpdatedAt: data.passwordUpdatedAt, token: data.token, method: "server" };
  }
  async function centralLogout() { try { await centralFetch("/api/auth/logout", { method: "POST" }); } catch {} }
  async function showEmailPanel(account) {
    if (account?.method !== "server") return alert("중앙 계정으로 로그인한 뒤 이메일을 설정할 수 있습니다.");
    document.querySelector("#fontoryEmailPanel")?.remove();
    try {
      const currentResponse = await centralFetch("/api/auth/me");
      const current = await currentResponse.json().catch(() => ({}));
      if (!currentResponse.ok) throw new Error(current.error || "계정 정보를 불러오지 못했습니다.");
      const panel = document.createElement("div");
      panel.id = "fontoryEmailPanel";
      panel.innerHTML = '<div class="email-card"><strong>내 이메일 설정</strong><p>이메일은 내 계정에만 저장됩니다. 관리자 계정은 이 주소로 로그인 인증 코드를 받습니다.</p><form id="emailForm"><label>이메일<input id="accountEmail" type="email" maxlength="254" autocomplete="email" placeholder="name@example.com"></label><div id="emailError" role="alert"></div><div class="email-actions"><button type="submit">저장</button><button type="button" id="clearEmailBtn" class="passkey-close">삭제</button><button type="button" id="closeEmailBtn" class="passkey-close">닫기</button></div></form></div>';
      document.body.appendChild(panel);
      panel.querySelector("#accountEmail").value = current.email || "";
      panel.querySelector("#closeEmailBtn").addEventListener("click", () => panel.remove());
      panel.querySelector("#clearEmailBtn").addEventListener("click", () => { panel.querySelector("#accountEmail").value = ""; });
      panel.querySelector("#emailForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = panel.querySelector("#accountEmail");
        const error = panel.querySelector("#emailError");
        error.textContent = "";
        const response = await centralFetch("/api/account/email", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: input.value.trim() }) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) { error.textContent = data.error || "이메일을 저장하지 못했습니다."; return; }
        alert(data.email ? "이메일을 저장했습니다." : "이메일을 삭제했습니다.");
        panel.remove();
      });
      panel.querySelector("#accountEmail").focus();
    } catch (error) { alert(error.message || "이메일 설정을 불러오지 못했습니다."); }
  }
  async function resolveLocal(user, password) {
    const [userHash, passwordHash] = await Promise.all([hash(user), hash(password)]);
    const managed = loadManaged().find((item) => item.userHash === userHash);
    if (managed) { if (managed.disabled) return null; if (managed.passHash === passwordHash) return { username: managed.username || user, role: managed.role || "user", method: "password" }; return null; }
    if (ACCOUNTS[userHash] && ACCOUNTS[userHash].pass === passwordHash && ACCOUNTS[userHash].role !== "disabled") return { username: user, role: ACCOUNTS[userHash].role, method: "password" };
    if (USERS[userHash] && PASSWORDS[passwordHash]) return { username: user, role: USERS[userHash].role, method: "password" };
    return null;
  }
  function showPasswordReminder(account) { if (account?.method !== "server") return; const wait = PASSWORD_REMINDER_DAYS * 24 * 60 * 60 * 1000; let dismissed = 0; try { dismissed = Number(localStorage.getItem(PASSWORD_REMINDER_KEY + ":" + account.username) || 0); } catch {} if (dismissed && Date.now() - dismissed < wait) return; document.querySelector("#fontoryPasswordReminder")?.remove(); const banner = document.createElement("div"); banner.id = "fontoryPasswordReminder"; banner.innerHTML = '<strong>비밀번호를 변경하시겠습니까?</strong><span>변경하지 않아도 로그인할 수 있습니다.</span><button type="button" id="remindLaterBtn">30일 후 다시</button><button type="button" id="closeReminderBtn" aria-label="닫기">닫기</button>'; document.body.appendChild(banner); banner.querySelector("#remindLaterBtn").addEventListener("click", () => { localStorage.setItem(PASSWORD_REMINDER_KEY + ":" + account.username, String(Date.now())); banner.remove(); }); banner.querySelector("#closeReminderBtn").addEventListener("click", () => banner.remove()); }
  function finishLogin(account) { const previous = session(); clearPending(); sessionStorage.setItem(KEY, JSON.stringify({ username: account.username, role: account.role, status: account.status, passwordUpdatedAt: account.passwordUpdatedAt || previous?.passwordUpdatedAt, token: account.token || previous?.token, method: account.method, date: todayKst(), authenticatedAt: Date.now() })); unlock(account); setTimeout(() => showPasswordReminder(account), 0); }
  function authShell(inner) { document.body.classList.add("auth-locked"); document.querySelector("#fontoryAuth")?.remove(); const box = document.createElement("div"); box.id = "fontoryAuth"; box.innerHTML = "<div class=\"auth-card\">" + inner + "</div>"; document.body.appendChild(box); }

  function passkeyUserId(username) { const key = "fontory-passkey-user:" + username; let value = localStorage.getItem(key); if (!value) { value = toB64(randomBytes(16)); localStorage.setItem(key, value); } return fromB64(value); }
  async function createPasskey(account) {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키를 만들 수 없습니다. HTTPS와 최신 브라우저가 필요합니다.");
    const exclude = loadPasskeys().filter((item) => item.username === account.username).map((item) => ({ type: "public-key", id: fromB64(item.credentialId) }));
    const credential = await navigator.credentials.create({ publicKey: { challenge: randomBytes(32), rp: { name: "Fontory", id: rpId() }, user: { id: passkeyUserId(account.username), name: account.username, displayName: account.username }, pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }], authenticatorSelection: { residentKey: "preferred", requireResidentKey: false, userVerification: "required" }, timeout: 120000, attestation: "none", excludeCredentials: exclude } });
    if (!credential) throw new Error("패스키 생성이 취소되었습니다.");
    const items = loadPasskeys(); items.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), rpId: rpId(), credentialId: toB64(credential.rawId), username: account.username, role: account.role, createdAt: Date.now(), transports: credential.response.getTransports ? credential.response.getTransports() : [] }); savePasskeys(items); return items[items.length - 1];
  }
  async function loginWithPasskey() {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키 로그인을 사용할 수 없습니다.");
    const items = loadPasskeys(); if (!items.length) throw new Error("등록된 패스키가 없습니다. 계정으로 접속한 뒤 패스키를 새로 만들어 주세요.");
    const assertion = await navigator.credentials.get({ publicKey: { challenge: randomBytes(32), rpId: rpId(), userVerification: "required", timeout: 120000, allowCredentials: items.map((item) => ({ type: "public-key", id: fromB64(item.credentialId), transports: item.transports?.length ? item.transports : undefined })) } });
    if (!assertion) throw new Error("패스키 로그인이 취소되었습니다.");
    const match = items.find((item) => item.credentialId === toB64(assertion.rawId)); if (!match) throw new Error("이 기기의 패스키를 이 사이트 계정과 연결할 수 없습니다."); return match;
  }
  function showPasskeyPanel(account) {
    document.querySelector("#fontoryPasskeyPanel")?.remove(); const items = loadPasskeys().filter((item) => item.username === account.username); const panel = document.createElement("div"); panel.id = "fontoryPasskeyPanel";
    panel.innerHTML = '<div class="passkey-card"><strong>새 패스키 만들기</strong><p>' + (items.length ? ("이 계정에 패스키 " + items.length + "개가 있습니다.") : "아직 패스키가 없습니다. 지금 이 기기에 새 패스키를 만들 수 있습니다.") + '</p><div class="passkey-list">' + items.map((item) => '<div class="passkey-row"><span>' + new Date(item.createdAt).toLocaleString("ko-KR") + '</span><button type="button" data-del="' + item.id + '">삭제</button></div>').join("") + '</div><button type="button" id="createPasskeyBtn">이 기기에 패스키 새로 만들기</button><button type="button" id="closePasskeyBtn" class="passkey-close">닫기</button><small>기존 패스키는 이 브라우저의 보안 저장소에 유지됩니다. ' + rpId() + " 주소에서만 동작합니다.</small></div>";
    document.body.appendChild(panel); panel.querySelector("#closePasskeyBtn").addEventListener("click", () => panel.remove());
    panel.querySelector("#createPasskeyBtn").addEventListener("click", async () => { const button = panel.querySelector("#createPasskeyBtn"); button.disabled = true; button.textContent = "기기에서 확인하세요…"; try { await createPasskey(account); alert("패스키를 만들었습니다."); showPasskeyPanel(account); } catch (error) { button.disabled = false; button.textContent = "이 기기에 패스키 새로 만들기"; const message = error?.name === "InvalidStateError" ? "이 기기에 이미 등록된 패스키입니다. 아래 목록에서 기존 패스키를 삭제하거나 다른 기기에서 다시 시도하세요." : error?.name === "NotAllowedError" ? "패스키 등록이 취소되었거나 기기 확인에 실패했습니다. Safari의 Face ID/기기 암호를 확인해 주세요." : (error.message || "패스키를 만들지 못했습니다."); alert(message); } });
    panel.querySelectorAll("[data-del]").forEach((button) => button.addEventListener("click", () => { savePasskeys(loadPasskeys().filter((item) => item.id !== button.dataset.del)); showPasskeyPanel(account); }));
  }
  function askDailyCode(account) { writePending(account); authShell('<div class="auth-mark">DAILY CODE</div><h1>오늘 코드 인증</h1><p>한국 시간 오늘 날짜 6자리를 입력하세요. 형식은 YYMMDD 입니다.</p><form id="dailyForm"><label>오늘 코드<input id="dailyCodeInput" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></label><button type="submit">확인</button><button id="backLogin" class="auth-passkey" type="button">계정 로그인으로</button><div id="authError" role="alert"></div></form><small>예: 2026년 9월 22일 = 260922</small>'); document.querySelector("#dailyCodeInput").focus(); document.querySelector("#backLogin").addEventListener("click", () => { clearPending(); mountLogin(); }); document.querySelector("#dailyForm").addEventListener("submit", async (event) => { event.preventDefault(); const typed = document.querySelector("#dailyCodeInput").value.replace(/\D/g, ""); if (typed !== await dailyCode()) return setError("오늘 코드가 올바르지 않습니다. 날짜 6자리를 입력하세요."); finishLogin(account); }); }
  function askAdminDailyCode(account) { writePending(account); authShell('<div class="auth-mark">FONTORY · ADMIN 2FA</div><h1>간편 코드 입력</h1><p>오늘의 간편 코드를 입력하세요.</p><form id="adminDailyForm"><label>간편 코드<input id="adminDailyCodeInput" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></label><button type="submit">확인</button><button id="backLogin" class="auth-passkey" type="button">인증 방법 다시 선택</button><div id="authError" role="alert"></div></form>'); document.querySelector("#adminDailyCodeInput").focus(); document.querySelector("#backLogin").addEventListener("click", () => askAdminMfaChoice(account)); document.querySelector("#adminDailyForm").addEventListener("submit", async (event) => { event.preventDefault(); const typed = document.querySelector("#adminDailyCodeInput").value.replace(/\D/g, ""); const button = event.submitter || document.querySelector("#adminDailyForm button[type=submit]"); if (button) { button.disabled = true; button.textContent = "확인 중…"; } setError(""); try { const result = await verifyCentralDaily(account.pendingToken, typed); finishLogin(result); } catch (error) { if (button) { button.disabled = false; button.textContent = "확인"; } setError(error.message || "간편 코드가 올바르지 않습니다."); } }); }
  function askAdminMfaChoice(account) { writePending(account); authShell('<div class="auth-mark">FONTORY · ADMIN 2FA</div><h1>인증 방법 선택</h1><p>편한 인증 방법을 선택하세요.</p><div class="admin-2fa-choice"><button id="adminEmailChoice" type="button">이메일로 인증 코드 받기</button><button id="adminDailyChoice" type="button" class="auth-passkey">간편 코드 입력</button></div><button id="backLogin" class="auth-passkey" type="button">로그인 화면으로</button><div id="authError" role="alert"></div>'); document.querySelector("#backLogin").addEventListener("click", () => { clearPending(); mountLogin(); }); document.querySelector("#adminEmailChoice").addEventListener("click", async () => { const button = document.querySelector("#adminEmailChoice"); button.disabled = true; button.textContent = "이메일 발송 중…"; setError(""); try { await sendCentralMfa(account.pendingToken); askMfa(account); } catch (error) { button.disabled = false; button.textContent = "이메일로 인증 코드 받기"; setError(error.message || "인증 코드 이메일 발송에 실패했습니다."); } }); document.querySelector("#adminDailyChoice").addEventListener("click", () => askAdminDailyCode(account)); }
  function askMfa(account) { writePending(account); authShell('<div class="auth-mark">FONTORY · EMAIL 2FA</div><h1>이메일 인증</h1><p>인증 메일은 계정당 1시간에 최대 5회 전송됩니다. 받은 최신 6자리 코드를 입력하세요.</p><form id="mfaForm"><label>인증 코드<input id="mfaCodeInput" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></label><button type="submit">최종 로그인</button><button id="backLogin" class="auth-passkey" type="button">로그인 화면으로</button><div id="authError" role="alert"></div></form>'); document.querySelector("#mfaCodeInput").focus(); document.querySelector("#backLogin").addEventListener("click", () => { clearPending(); mountLogin(); }); document.querySelector("#mfaForm").addEventListener("submit", async (event) => { event.preventDefault(); const button = event.submitter || document.querySelector('#mfaForm button[type="submit"]'); if (button?.disabled) return; if (button) { button.disabled = true; button.textContent = "확인 중…"; } setError(""); try { const result = await verifyCentralMfa(account.pendingToken, document.querySelector("#mfaCodeInput").value.trim()); finishLogin(result); } catch (error) { if (button) { button.disabled = false; button.textContent = "최종 로그인"; } setError(error.message || "인증에 실패했습니다."); } }); }
  function mountLogin() { authShell('<div class="auth-mark">FONTORY · PRIVATE ACCESS</div><h1>글꼴 보관소</h1><p class="auth-typing-greeting" data-typing-greeting aria-label="로그인하고 Fontory의 다양한 혜택을 만나보세요."></p><p>등록된 중앙 계정으로 접속하세요. 기존 기기 패스키도 계속 사용할 수 있습니다.</p><form id="authForm"><label>아이디<input id="authUser" autocomplete="username" required></label><label>비밀번호<input id="authPass" type="password" autocomplete="current-password" required></label><button type="submit">계정 로그인</button><button id="passkeyButton" class="auth-passkey" type="button">패스키로 접속</button><a class="auth-preview-link" href="./preview.html">로그인 없이 폰트 미리보기</a><div id="authError" role="alert"></div></form><small>관리자 계정은 이메일 2FA를 거친 뒤 로그인됩니다. 패스키 로그인은 기존대로 이 기기에서 사용할 수 있습니다.</small>'); document.querySelector("#authUser").focus(); document.querySelector("#authForm").addEventListener("submit", async (event) => { event.preventDefault(); const button = event.submitter || document.querySelector('#authForm button[type="submit"]'); if (button?.disabled) return; if (button) { button.disabled = true; button.textContent = "확인 중…"; } setError(""); const user = document.querySelector("#authUser").value.trim(); const password = document.querySelector("#authPass").value; try { const central = await centralLogin(user, password); if (central) { if (central.mfaRequired) { if (central.role === "admin" && central.mfaMethods?.includes("daily")) askAdminMfaChoice(central); else askMfa(central); } else finishLogin(central); return; } setError("중앙 인증 서버에서 계정을 확인하지 못했습니다."); } catch (error) { setError(error.message || "중앙 인증 서버에 연결할 수 없습니다."); if (button) { button.disabled = false; button.textContent = "계정 로그인"; } } }); document.querySelector("#passkeyButton").addEventListener("click", async () => { setError(""); const button = document.querySelector("#passkeyButton"); button.disabled = true; button.textContent = "패스키 확인 중…"; try { const match = await loginWithPasskey(); finishLogin({ username: match.username, role: match.role, method: "passkey" }); } catch (error) { setError(error.message || "패스키로 접속하지 못했습니다."); button.disabled = false; button.textContent = "패스키로 접속"; } }); }

  async function showCentralAdminPanel(account) {
    document.querySelector("#fontoryAdminPanel")?.remove(); try {
      const response = await centralFetch("/api/accounts"); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "중앙 계정 관리 서버에 연결할 수 없습니다."); const accounts = Array.isArray(data.accounts) ? data.accounts : [];
      const rows = accounts.map((item) => '<tr><td><code>' + escapeAuth(item.username) + '</code></td><td>' + (item.role === "admin" ? "중앙 관리자" : "일반 사용자") + '</td><td>' + escapeAuth(item.email || "미등록") + '</td><td>' + (item.disabled ? "중지" : "활성") + '</td><td>' + (item.skip_wait ? "생략" : "대기") + '</td><td class="admin-actions"><button type="button" data-wait="' + escapeAuth(item.username) + '" data-skip="' + (item.skip_wait ? "1" : "0") + '">' + (item.skip_wait ? "대기 켜기" : "대기 생략") + '</button><button type="button" data-edit="' + escapeAuth(item.username) + '">비번변경</button><button type="button" data-email="' + escapeAuth(item.username) + '">이메일</button>' + (item.username === account.username ? "" : '<button type="button" data-off="' + escapeAuth(item.username) + '">' + (item.disabled ? "켜기" : "중지") + '</button><button type="button" data-del="' + escapeAuth(item.username) + '">삭제</button>') + '</td></tr>').join("");
      const panel = document.createElement("div"); panel.id = "fontoryAdminPanel"; panel.innerHTML = '<div class="admin-card"><strong>사용자 관리</strong><p>중앙 D1의 전체 사용자를 관리합니다. 아래에서 새 사용자 또는 중앙 관리자를 추가할 수 있습니다.</p><h3 class="admin-subtitle">새 사용자 추가</h3><form id="adminAddForm" class="admin-form"><input id="newUser" placeholder="아이디" required autocomplete="off"><input id="newPass" placeholder="비밀번호 (8자 이상)" required autocomplete="new-password"><input id="newEmail" type="email" maxlength="254" placeholder="이메일 (선택)"><select id="newRole"><option value="user">일반 사용자</option><option value="admin">중앙 관리자</option></select><button type="submit">새 사용자 추가</button></form><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>아이디</th><th>역할</th><th>이메일</th><th>상태</th><th>다운로드</th><th>관리</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="admin-foot"><small>변경 사항은 중앙 D1에 즉시 저장됩니다.</small><button type="button" id="closeAdminBtn" class="passkey-close">닫기</button></div></div>'; document.body.appendChild(panel);
      panel.querySelector("#closeAdminBtn").addEventListener("click", () => panel.remove());
      panel.querySelector("#adminAddForm").addEventListener("submit", async (event) => { event.preventDefault(); const body = { username: panel.querySelector("#newUser").value.trim(), password: panel.querySelector("#newPass").value, role: panel.querySelector("#newRole").value, email: panel.querySelector("#newEmail").value.trim() || null }; const r = await centralFetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "계정을 추가하지 못했습니다."); alert("중앙 D1에 저장했습니다."); showCentralAdminPanel(account); });
      panel.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", async () => { const password = prompt(button.dataset.edit + " 계정의 새 비밀번호"); if (!password) return; const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.edit) + "/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "비밀번호를 변경하지 못했습니다."); alert("변경했습니다."); showCentralAdminPanel(account); }));
      panel.querySelectorAll("[data-email]").forEach((button) => button.addEventListener("click", async () => { const email = prompt(button.dataset.email + " 계정의 이메일 주소", ""); if (email === null) return; const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.email) + "/email", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "이메일을 변경하지 못했습니다."); alert(d.email ? "이메일을 변경했습니다." : "이메일을 삭제했습니다."); showCentralAdminPanel(account); }));
      panel.querySelectorAll("[data-wait]").forEach((button) => button.addEventListener("click", async () => { const username = button.dataset.wait; const skipWait = button.dataset.skip !== "1"; const r = await centralFetch("/api/account/download-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, skipWait }) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "다운로드 대기 설정을 변경하지 못했습니다."); showCentralAdminPanel(account); })); panel.querySelectorAll("[data-off]").forEach((button) => button.addEventListener("click", async () => { const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.off) + "/disable", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ disabled: button.textContent !== "켜기" }) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "상태를 변경하지 못했습니다."); showCentralAdminPanel(account); }));
      panel.querySelectorAll("[data-del]").forEach((button) => button.addEventListener("click", async () => { if (!confirm(button.dataset.del + " 계정을 삭제할까요?")) return; const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.del), { method: "DELETE" }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "삭제하지 못했습니다."); showCentralAdminPanel(account); }));
    } catch (error) { alert(error.message || "중앙 계정 관리 서버에 연결하지 못했습니다."); }
  }
  async function showMusicAdminPanel(account) {
    if (account?.method !== "server" || account.role !== "admin") return alert("관리자 계정으로 로그인해 주세요.");
    document.querySelector("#fontoryMusicPanel")?.remove();
    try {
      const catalog = await (window.fontoryGetMusicCatalog?.() || Promise.resolve([]));
      const currentResponse = await centralFetch("/api/music");
      const currentData = await currentResponse.json().catch(() => ({}));
      if (!currentResponse.ok) throw new Error(currentData.error || "음악 설정을 불러오지 못했습니다.");
      const loginId = currentData.loginMusicId || currentData.musicId || currentData.selectedMusicId || catalog[0]?.id || "";
      const downloadMode = currentData.downloadMode === "random" ? "random" : "admin-selected";
      const downloadId = currentData.downloadMusicId || currentData.downloadSelectedMusicId || catalog[0]?.id || "";
      const formatTrackDuration = (durationMs) => {
        const value = Number(durationMs);
        if (!Number.isSafeInteger(value) || value <= 0) return "길이 정보 없음";
        const totalSeconds = Math.round(value / 1000);
        return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
      };
      const options = catalog.map((item) => {
        const label = `${item.name} · ${formatTrackDuration(item.durationMs)}`;
        return '<option value="' + escapeAuth(item.id) + '">' + escapeAuth(label) + '</option>';
      }).join("");
      const panel = document.createElement("div");
      panel.id = "fontoryMusicPanel";
      panel.innerHTML = '<div class="admin-card"><strong>Fontory 음악 관리</strong>' +
        '<p>로그인 음악과 다운로드 진행 음악을 서로 독립적으로 설정합니다.</p>' +
        '<div class="admin-music-section"><h3>로그인 화면 음악</h3><select id="loginMusicSelect">' + options + '</select></div>' +
        '<div class="admin-music-section"><h3>다운로드 진행 음악</h3><label><input type="radio" name="downloadMusicMode" value="admin-selected"> 직접 선택</label> <label><input type="radio" name="downloadMusicMode" value="random"> 랜덤</label>' +
        '<select id="downloadMusicSelect">' + options + '</select><p class="small">랜덤은 다운로드가 시작될 때마다 한 곡을 새로 선택하고, 한 번의 다운로드 중에는 유지됩니다.</p></div>' +
        '<div class="admin-music-actions"><button type="button" id="saveMusicBtn">저장</button><button type="button" id="closeMusicBtn" class="passkey-close">닫기</button></div><div id="musicAdminStatus" class="admin-music-status"></div></div>';
      document.body.appendChild(panel);
      panel.querySelector("#loginMusicSelect").value = loginId;
      panel.querySelector("#downloadMusicSelect").value = downloadId;
      panel.querySelector('input[name="downloadMusicMode"][value="' + downloadMode + '"]').checked = true;
      panel.querySelector("#closeMusicBtn").addEventListener("click", () => panel.remove());
      panel.querySelector("#saveMusicBtn").addEventListener("click", async () => {
        const button = panel.querySelector("#saveMusicBtn");
        const status = panel.querySelector("#musicAdminStatus");
        button.disabled = true;
        status.textContent = "저장 중…";
        try {
          const response = await centralFetch("/api/music", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              musicId: panel.querySelector("#loginMusicSelect").value,
              loginMusicId: panel.querySelector("#loginMusicSelect").value,
              downloadMode: panel.querySelector('input[name="downloadMusicMode"]:checked')?.value || "admin-selected",
              downloadMusicId: panel.querySelector("#downloadMusicSelect").value,
            }),
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || "음악 설정을 저장하지 못했습니다.");
          window.fontoryResetMusicCache?.();
          document.dispatchEvent(new Event("fontory-music-changed"));
          status.textContent = "저장했습니다. 로그인 음악과 다운로드 음악 설정을 각각 적용합니다.";
        } catch (error) {
          status.textContent = error.message || "음악 설정을 저장하지 못했습니다.";
        } finally {
          button.disabled = false;
        }
      });
    } catch (error) {
      alert(error.message || "음악 설정을 불러오지 못했습니다.");
    }
  }
  async function showPasswordPanel(account) { if (account?.method !== "server") return alert("중앙 계정으로 로그인한 뒤 비밀번호를 변경할 수 있습니다."); document.querySelector("#fontoryPasswordPanel")?.remove(); const panel = document.createElement("div"); panel.id = "fontoryPasswordPanel"; panel.innerHTML = '<div class="email-card"><strong>내 비밀번호 변경</strong><p>기존 비밀번호는 보안상 저장된 해시에서 다시 볼 수 없습니다. 새 비밀번호 입력 중에는 보기 버튼을 사용할 수 있습니다.</p><form id="passwordForm"><label>새 비밀번호<input id="newOwnPassword" type="password" minlength="8" autocomplete="new-password" required><button type="button" class="passkey-close" data-toggle="newOwnPassword">보기</button></label><label>새 비밀번호 확인<input id="confirmOwnPassword" type="password" minlength="8" autocomplete="new-password" required><button type="button" class="passkey-close" data-toggle="confirmOwnPassword">보기</button></label><div id="passwordError" role="alert"></div><div class="email-actions"><button type="submit">변경</button><button type="button" id="closePasswordBtn" class="passkey-close">닫기</button></div></form></div>'; document.body.appendChild(panel); panel.querySelector("#closePasswordBtn").addEventListener("click", () => panel.remove()); panel.querySelectorAll("[data-toggle]").forEach((button) => button.addEventListener("click", () => { const input = panel.querySelector("#" + button.dataset.toggle); input.type = input.type === "password" ? "text" : "password"; button.textContent = input.type === "password" ? "보기" : "숨기기"; })); panel.querySelector("#newOwnPassword").focus(); panel.querySelector("#passwordForm").addEventListener("submit", async (event) => { event.preventDefault(); const password = panel.querySelector("#newOwnPassword").value; const confirmPassword = panel.querySelector("#confirmOwnPassword").value; const error = panel.querySelector("#passwordError"); if (password !== confirmPassword) { error.textContent = "새 비밀번호가 일치하지 않습니다."; return; } const response = await centralFetch("/api/account/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); const data = await response.json().catch(() => ({})); if (!response.ok) { error.textContent = data.error || "비밀번호를 변경하지 못했습니다."; return; } alert("비밀번호를 변경했습니다."); panel.remove(); }); }
  function showAdminPanel(account) { if (account?.method === "server") return showCentralAdminPanel(account); alert("패스키 로그인은 이 기기 전용입니다. 중앙 계정 관리는 로그아웃 후 아이디·비밀번호와 이메일 인증 코드로 로그인해 주세요."); }
  async function unlock(account) { document.body.classList.remove("auth-locked"); window.dispatchEvent(new CustomEvent("fontory-auth-unlocked", { detail: { username: account?.username || "", role: account?.role || "user" } })); document.querySelector("#fontoryAuth")?.remove(); document.querySelector("#fontoryPasskeyPanel")?.remove(); document.querySelector("#fontoryEmailPanel")?.remove(); document.querySelector("#fontoryPasswordPanel")?.remove(); document.querySelector(".auth-logout")?.remove(); document.querySelector(".auth-passkey-manage")?.remove(); window.__fontorySkipDownloadWait = false; if (account.method === "server") { try { const waitResponse = await centralFetch("/api/account/download-settings"); const waitData = await waitResponse.json().catch(() => ({})); if (waitResponse.ok) window.__fontorySkipDownloadWait = waitData.skipWait === true; } catch {} } document.querySelector(".auth-email-manage")?.remove(); document.querySelector(".auth-password-manage")?.remove(); document.querySelector(".auth-daily-code")?.remove(); document.querySelectorAll(".auth-admin-manage").forEach((node) => node.remove()); document.querySelector("#fontoryAdminPanel")?.remove(); const topbar = document.querySelector(".topbar"); if (!topbar) return; if (account.method === "server") { const emailBtn = document.createElement("button"); emailBtn.type = "button"; emailBtn.className = "auth-email-manage"; emailBtn.textContent = "이메일 설정"; emailBtn.addEventListener("click", () => showEmailPanel(account)); topbar.appendChild(emailBtn); const passwordBtn = document.createElement("button"); passwordBtn.type = "button"; passwordBtn.className = "auth-password-manage"; passwordBtn.textContent = "비밀번호 변경"; passwordBtn.addEventListener("click", () => showPasswordPanel(account)); topbar.appendChild(passwordBtn); } if (account.role === "admin" && account.method === "server") { const adminBtn = document.createElement("button"); adminBtn.type = "button"; adminBtn.className = "auth-admin-manage"; adminBtn.textContent = "계정 관리"; adminBtn.addEventListener("click", () => showAdminPanel(account)); topbar.appendChild(adminBtn); const musicBtn = document.createElement("button"); musicBtn.type = "button"; musicBtn.className = "auth-admin-manage"; musicBtn.textContent = "음악 관리"; musicBtn.addEventListener("click", () => showMusicAdminPanel(account)); topbar.appendChild(musicBtn); } const passkeyBtn = document.createElement("button"); passkeyBtn.type = "button"; passkeyBtn.className = "auth-passkey-manage"; passkeyBtn.textContent = "패스키 만들기"; passkeyBtn.addEventListener("click", () => showPasskeyPanel(account)); topbar.appendChild(passkeyBtn); const logout = document.createElement("button"); logout.type = "button"; logout.className = "auth-logout"; logout.textContent = account.role === "admin" ? "관리자 · 로그아웃" : "로그아웃"; logout.addEventListener("click", async () => { if (account.method === "server") await centralLogout(); sessionStorage.removeItem(KEY); clearPending(); location.reload(); }); topbar.appendChild(logout); }

  async function startAuth() {
    const central = await centralMe(); if (central) { finishLogin({ username: central.username, role: central.role, status: central.status, passwordUpdatedAt: central.passwordUpdatedAt, method: "server" }); return; }
    const current = session(); if (current && current.method === "passkey" && current.role && current.date === todayKst()) { unlock({ username: current.username || "account", role: current.role, method: current.method }); return; }
    sessionStorage.removeItem(KEY); const pending = readPending(); if (pending?.mfaRequired && pending.pendingToken) { sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending)); if (pending.role === "admin" && pending.mfaMethods?.includes("daily")) askAdminMfaChoice(pending); else askMfa(pending); } else if (pending?.username && pending.role && pending.method !== "passkey") { sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending)); askDailyCode(pending); } else mountLogin();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startAuth, { once: true }); else startAuth();
})();
