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
  const MANAGED_KEY = "fontory-managed-accounts-v1";
  const CENTRAL_API = "https://fontory-api.fontory.workers.dev";

  const hash = async (value) => {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  const todayKst = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const dailyCode = async () => { const [year, month, day] = todayKst().split("-"); return year.slice(-2) + month + day; };
  const session = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; } };
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
    return fetch(CENTRAL_API + path, { credentials: "include", ...options });
  }
  async function centralMe() {
    try { const response = await centralFetch("/api/auth/me"); if (!response.ok) return null; return await response.json(); } catch { return null; }
  }
  async function centralLogin(username, password) {
    try {
      const response = await centralFetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return null;
      if (data.mfaRequired && data.pendingToken) return { username, role: "admin", method: "server", mfaRequired: true, pendingToken: data.pendingToken };
      return data.username ? { username: data.username, role: data.role || "user", status: data.status, method: "server" } : null;
    } catch { return null; }
  }
  async function verifyCentralMfa(pendingToken, code) {
    const response = await centralFetch("/api/auth/mfa/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pendingToken, code }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "인증 코드가 올바르지 않습니다.");
    return { username: data.username || "admin", role: data.role || "admin", status: data.status, method: "server" };
  }
  async function centralLogout() { try { await centralFetch("/api/auth/logout", { method: "POST" }); } catch {} }
  async function resolveLocal(user, password) {
    const [userHash, passwordHash] = await Promise.all([hash(user), hash(password)]);
    const managed = loadManaged().find((item) => item.userHash === userHash);
    if (managed) { if (managed.disabled) return null; if (managed.passHash === passwordHash) return { username: managed.username || user, role: managed.role || "user", method: "password" }; return null; }
    if (ACCOUNTS[userHash] && ACCOUNTS[userHash].pass === passwordHash && ACCOUNTS[userHash].role !== "disabled") return { username: user, role: ACCOUNTS[userHash].role, method: "password" };
    if (USERS[userHash] && PASSWORDS[passwordHash]) return { username: user, role: USERS[userHash].role, method: "password" };
    return null;
  }
  function finishLogin(account) { sessionStorage.removeItem(PENDING_KEY); sessionStorage.setItem(KEY, JSON.stringify({ username: account.username, role: account.role, status: account.status, method: account.method, date: todayKst(), authenticatedAt: Date.now() })); unlock(account); }
  function authShell(inner) { document.body.classList.add("auth-locked"); document.querySelector("#fontoryAuth")?.remove(); const box = document.createElement("div"); box.id = "fontoryAuth"; box.innerHTML = "<div class=\"auth-card\">" + inner + "</div>"; document.body.appendChild(box); }

  async function createPasskey(account) {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키를 만들 수 없습니다. HTTPS와 최신 브라우저가 필요합니다.");
    const exclude = loadPasskeys().filter((item) => item.username === account.username).map((item) => ({ type: "public-key", id: fromB64(item.credentialId) }));
    const credential = await navigator.credentials.create({ publicKey: { challenge: randomBytes(32), rp: { name: "Fontory", id: rpId() }, user: { id: randomBytes(16), name: account.username, displayName: account.username }, pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }], authenticatorSelection: { residentKey: "preferred", requireResidentKey: false, userVerification: "required" }, timeout: 120000, attestation: "none", excludeCredentials: exclude } });
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
    panel.querySelector("#createPasskeyBtn").addEventListener("click", async () => { const button = panel.querySelector("#createPasskeyBtn"); button.disabled = true; button.textContent = "기기에서 확인하세요…"; try { await createPasskey(account); alert("패스키를 만들었습니다."); showPasskeyPanel(account); } catch (error) { button.disabled = false; button.textContent = "이 기기에 패스키 새로 만들기"; alert(error.message || "패스키를 만들지 못했습니다."); } });
    panel.querySelectorAll("[data-del]").forEach((button) => button.addEventListener("click", () => { savePasskeys(loadPasskeys().filter((item) => item.id !== button.dataset.del)); showPasskeyPanel(account); }));
  }
  function askDailyCode(account) { sessionStorage.setItem(PENDING_KEY, JSON.stringify(account)); authShell('<div class="auth-mark">DAILY CODE</div><h1>오늘 코드 인증</h1><p>한국 시간 오늘 날짜 6자리를 입력하세요. 형식은 YYMMDD 입니다.</p><form id="dailyForm"><label>오늘 코드<input id="dailyCodeInput" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></label><button type="submit">확인</button><button id="backLogin" class="auth-passkey" type="button">계정 로그인으로</button><div id="authError" role="alert"></div></form><small>예: 2026년 9월 22일 = 260922</small>'); document.querySelector("#dailyCodeInput").focus(); document.querySelector("#backLogin").addEventListener("click", () => { sessionStorage.removeItem(PENDING_KEY); mountLogin(); }); document.querySelector("#dailyForm").addEventListener("submit", async (event) => { event.preventDefault(); const typed = document.querySelector("#dailyCodeInput").value.replace(/\D/g, ""); if (typed !== await dailyCode()) return setError("오늘 코드가 올바르지 않습니다. 날짜 6자리를 입력하세요."); finishLogin(account); }); }
  function askMfa(account) { sessionStorage.setItem(PENDING_KEY, JSON.stringify(account)); authShell('<div class="auth-mark">FONTORY · EMAIL 2FA</div><h1>이메일 인증</h1><p>등록된 이메일로 보낸 6자리 인증 코드를 입력하세요.</p><form id="mfaForm"><label>인증 코드<input id="mfaCodeInput" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></label><button type="submit">최종 로그인</button><button id="backLogin" class="auth-passkey" type="button">로그인 화면으로</button><div id="authError" role="alert"></div></form>'); document.querySelector("#mfaCodeInput").focus(); document.querySelector("#backLogin").addEventListener("click", () => { sessionStorage.removeItem(PENDING_KEY); mountLogin(); }); document.querySelector("#mfaForm").addEventListener("submit", async (event) => { event.preventDefault(); setError(""); try { const result = await verifyCentralMfa(account.pendingToken, document.querySelector("#mfaCodeInput").value.trim()); finishLogin(result); } catch (error) { setError(error.message || "인증에 실패했습니다."); } }); }
  function mountLogin() { authShell('<div class="auth-mark">FONTORY · PRIVATE ACCESS</div><h1>글꼴 보관소</h1><p>등록된 중앙 계정으로 접속하세요. 기존 기기 패스키도 계속 사용할 수 있습니다.</p><form id="authForm"><label>아이디<input id="authUser" autocomplete="username" required></label><label>비밀번호<input id="authPass" type="password" autocomplete="current-password" required></label><button type="submit">계정 로그인</button><button id="passkeyButton" class="auth-passkey" type="button">패스키로 접속</button><div id="authError" role="alert"></div></form><small>관리자 계정은 이메일 2FA를 거친 뒤 로그인됩니다. 패스키 로그인은 기존대로 이 기기에서 사용할 수 있습니다.</small>'); document.querySelector("#authUser").focus(); document.querySelector("#authForm").addEventListener("submit", async (event) => { event.preventDefault(); setError(""); const user = document.querySelector("#authUser").value.trim(); const password = document.querySelector("#authPass").value; const central = await centralLogin(user, password); if (central) { if (central.mfaRequired) askMfa(central); else finishLogin(central); return; } const local = await resolveLocal(user, password); if (local) askDailyCode(local); else setError("아이디 또는 비밀번호가 올바르지 않습니다."); }); document.querySelector("#passkeyButton").addEventListener("click", async () => { setError(""); const button = document.querySelector("#passkeyButton"); button.disabled = true; button.textContent = "패스키 확인 중…"; try { const match = await loginWithPasskey(); finishLogin({ username: match.username, role: match.role, method: "passkey" }); } catch (error) { setError(error.message || "패스키로 접속하지 못했습니다."); button.disabled = false; button.textContent = "패스키로 접속"; } }); }

  async function showCentralAdminPanel(account) {
    document.querySelector("#fontoryAdminPanel")?.remove(); try {
      const response = await centralFetch("/api/accounts"); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "중앙 계정 관리 서버에 연결할 수 없습니다."); const accounts = Array.isArray(data.accounts) ? data.accounts : [];
      const rows = accounts.map((item) => '<tr><td><code>' + escapeAuth(item.username) + '</code></td><td>' + escapeAuth(item.role || "user") + '</td><td>' + (item.disabled ? "중지" : "활성") + '</td><td class="admin-actions"><button type="button" data-edit="' + escapeAuth(item.username) + '">비번변경</button>' + (item.username === account.username ? "" : '<button type="button" data-off="' + escapeAuth(item.username) + '">' + (item.disabled ? "켜기" : "중지") + '</button><button type="button" data-del="' + escapeAuth(item.username) + '">삭제</button>') + '</td></tr>').join("");
      const panel = document.createElement("div"); panel.id = "fontoryAdminPanel"; panel.innerHTML = '<div class="admin-card"><strong>중앙 계정 관리</strong><p>Cloudflare D1 중앙 DB의 계정입니다. 다른 브라우저와 기기에서도 같은 목록을 사용합니다.</p><form id="adminAddForm" class="admin-form"><input id="newUser" placeholder="아이디" required autocomplete="off"><input id="newPass" placeholder="비밀번호" required autocomplete="new-password"><input id="newEmail" type="email" placeholder="이메일 (관리자 MFA용)"><select id="newRole"><option value="user">사용자</option><option value="admin">관리자</option></select><button type="submit">계정 추가</button></form><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>아이디</th><th>역할</th><th>상태</th><th>관리</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="admin-foot"><small>변경 사항은 중앙 D1에 즉시 저장됩니다.</small><button type="button" id="closeAdminBtn" class="passkey-close">닫기</button></div></div>'; document.body.appendChild(panel);
      panel.querySelector("#closeAdminBtn").addEventListener("click", () => panel.remove());
      panel.querySelector("#adminAddForm").addEventListener("submit", async (event) => { event.preventDefault(); const body = { username: panel.querySelector("#newUser").value.trim(), password: panel.querySelector("#newPass").value, role: panel.querySelector("#newRole").value, email: panel.querySelector("#newEmail").value.trim() || null }; const r = await centralFetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "계정을 추가하지 못했습니다."); alert("중앙 D1에 저장했습니다."); showCentralAdminPanel(account); });
      panel.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", async () => { const password = prompt(button.dataset.edit + " 계정의 새 비밀번호"); if (!password) return; const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.edit) + "/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "비밀번호를 변경하지 못했습니다."); alert("변경했습니다."); showCentralAdminPanel(account); }));
      panel.querySelectorAll("[data-off]").forEach((button) => button.addEventListener("click", async () => { const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.off) + "/disable", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ disabled: button.textContent !== "켜기" }) }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "상태를 변경하지 못했습니다."); showCentralAdminPanel(account); }));
      panel.querySelectorAll("[data-del]").forEach((button) => button.addEventListener("click", async () => { if (!confirm(button.dataset.del + " 계정을 삭제할까요?")) return; const r = await centralFetch("/api/accounts/" + encodeURIComponent(button.dataset.del), { method: "DELETE" }); const d = await r.json().catch(() => ({})); if (!r.ok) return alert(d.error || "삭제하지 못했습니다."); showCentralAdminPanel(account); }));
    } catch (error) { alert(error.message || "중앙 계정 관리 서버에 연결하지 못했습니다."); }
  }
  function showAdminPanel(account) { if (account?.method === "server") return showCentralAdminPanel(account); alert("중앙 관리자 계정으로 로그인하면 모든 기기에서 중앙 계정을 관리할 수 있습니다."); }
  async function unlock(account) { document.body.classList.remove("auth-locked"); document.querySelector("#fontoryAuth")?.remove(); document.querySelector("#fontoryPasskeyPanel")?.remove(); document.querySelector(".auth-logout")?.remove(); document.querySelector(".auth-passkey-manage")?.remove(); document.querySelector(".auth-daily-code")?.remove(); document.querySelector(".auth-admin-manage")?.remove(); document.querySelector("#fontoryAdminPanel")?.remove(); const topbar = document.querySelector(".topbar"); if (!topbar) return; if (account.role === "admin") { const adminBtn = document.createElement("button"); adminBtn.type = "button"; adminBtn.className = "auth-admin-manage"; adminBtn.textContent = "계정 관리"; adminBtn.addEventListener("click", () => showAdminPanel(account)); topbar.appendChild(adminBtn); } const passkeyBtn = document.createElement("button"); passkeyBtn.type = "button"; passkeyBtn.className = "auth-passkey-manage"; passkeyBtn.textContent = "패스키 만들기"; passkeyBtn.addEventListener("click", () => showPasskeyPanel(account)); topbar.appendChild(passkeyBtn); const logout = document.createElement("button"); logout.type = "button"; logout.className = "auth-logout"; logout.textContent = account.role === "admin" ? "관리자 · 로그아웃" : "로그아웃"; logout.addEventListener("click", async () => { if (account.method === "server") await centralLogout(); sessionStorage.removeItem(KEY); sessionStorage.removeItem(PENDING_KEY); location.reload(); }); topbar.appendChild(logout); }

  async function startAuth() {
    const central = await centralMe(); if (central) { finishLogin({ username: central.username, role: central.role, status: central.status, method: "server" }); return; }
    const current = session(); if (current && current.role && current.date === todayKst()) { unlock({ username: current.username || "account", role: current.role, method: current.method }); return; }
    sessionStorage.removeItem(KEY); let pending = null; try { pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null"); } catch {} if (pending?.mfaRequired && pending.pendingToken) askMfa(pending); else if (pending?.username && pending.role && pending.method !== "passkey") askDailyCode(pending); else mountLogin();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startAuth, { once: true }); else startAuth();
})();
