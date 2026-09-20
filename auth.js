(() => {
  const USERS = {
    "76671c0f8ca2aa9f898af7d22da44e1136ceea025348147859f59b9bc905a": { role: "admin" },
    "414cb10fdc75ee2a9853bbcf8c93c8cf3888de2e66c6a84307e1ff914ef3ffa8": { role: "user" },
    "00b0d881f3ca4cae478554ec2c5148e41f2cbd8528564c123a6ab8d8845ddc60": { role: "user" },
    "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": { role: "admin" }
  };

  const PASSWORDS = {
    "6280ab472481a292f4391e28f6f3c42c329dad577fd4afda33b2720f4a18b7f0": true,
    "40d354f5efb6114fab5a8df72caa4f836f527ad3b1d255a51dcb9f6836ae687a": true,
    "41d1fbe61da30ec3532e430faee074a6a7174332c6a07b623765a776a530bb34": true,
    "548a492529d0fa2943de0362cbc497bb252bada198526523a26739abe298d110": true
  };

  const KEY = "fontory-auth-v2";
  const PASSKEY_KEY = "fontory-passkeys-v1";

  const hash = async (value) => {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const session = () => {
    try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); }
    catch { return null; }
  };

  const rpId = () => location.hostname;
  const webauthnOk = () => window.isSecureContext && typeof window.PublicKeyCredential === "function" && typeof navigator.credentials?.create === "function";

  const toB64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  };

  const fromB64 = (value) => {
    const pad = "=".repeat((4 - (value.length % 4)) % 4);
    const raw = atob(value.replace(/-/g, "+").replace(/_/g, "/") + pad);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
    return out.buffer;
  };

  const loadPasskeys = () => {
    try {
      const all = JSON.parse(localStorage.getItem(PASSKEY_KEY) || "[]");
      return Array.isArray(all) ? all.filter((item) => item.rpId === rpId()) : [];
    } catch { return []; }
  };

  const savePasskeys = (items) => {
    let others = [];
    try { others = JSON.parse(localStorage.getItem(PASSKEY_KEY) || "[]").filter((item) => item.rpId !== rpId()); } catch {}
    localStorage.setItem(PASSKEY_KEY, JSON.stringify([...others, ...items]));
  };

  const setError = (text) => {
    const error = document.querySelector("#authError");
    if (error) error.textContent = text || "";
  };

  const randomBytes = (size) => crypto.getRandomValues(new Uint8Array(size));

  async function createPasskey(account) {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키를 만들 수 없습니다. HTTPS와 최신 브라우저가 필요합니다.");
    const userId = randomBytes(16);
    const exclude = loadPasskeys().filter((item) => item.username === account.username).map((item) => ({ type: "public-key", id: fromB64(item.credentialId) }));
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { name: "Fontory", id: rpId() },
        user: { id: userId, name: account.username, displayName: account.username },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { residentKey: "preferred", requireResidentKey: false, userVerification: "required" },
        timeout: 120000,
        attestation: "none",
        excludeCredentials: exclude
      }
    });
    if (!credential) throw new Error("패스키 생성이 취소되었습니다.");
    const items = loadPasskeys();
    items.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      rpId: rpId(),
      credentialId: toB64(credential.rawId),
      username: account.username,
      role: account.role,
      createdAt: Date.now(),
      transports: credential.response.getTransports?.() || []
    });
    savePasskeys(items);
    return items.at(-1);
  }

  async function loginWithPasskey() {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키 로그인을 사용할 수 없습니다.");
    const items = loadPasskeys();
    if (!items.length) throw new Error("등록된 패스키가 없습니다. 먼저 아이디와 비밀번호로 접속한 뒤 패스키를 만들어 주세요.");
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        rpId: rpId(),
        userVerification: "required",
        timeout: 120000,
        allowCredentials: items.map((item) => ({
          type: "public-key",
          id: fromB64(item.credentialId),
          transports: item.transports && item.transports.length ? item.transports : undefined
        }))
      }
    });
    if (!assertion) throw new Error("패스키 로그인이 취소되었습니다.");
    const match = items.find((item) => item.credentialId === toB64(assertion.rawId));
    if (!match) throw new Error("이 기기의 패스키를 이 사이트 계정과 연결할 수 없습니다.");
    return match;
  }

  function showPasskeyPanel(account) {
    document.querySelector("#fontoryPasskeyPanel")?.remove();
    const items = loadPasskeys().filter((item) => item.username === account.username);
    const panel = document.createElement("div");
    panel.id = "fontoryPasskeyPanel";
    panel.innerHTML = `
      <div class="passkey-card">
        <strong>패스키</strong>
        <p>${items.length ? `${items.length}개 등록됨` : "아직 등록된 패스키가 없습니다."}</p>
        <div class="passkey-list">
          ${items.map((item) => `<div class="passkey-row"><span>${new Date(item.createdAt).toLocaleString("ko-KR")}</span><button type="button" data-del="${item.id}">삭제</button></div>`).join("")}
        </div>
        <button type="button" id="createPasskeyBtn">패스키 만들기</button>
        <button type="button" id="closePasskeyBtn" class="passkey-close">닫기</button>
        <small>Face ID, Touch ID, Windows Hello, 보안 키로 만들 수 있습니다. 이 주소(${rpId()})에서만 사용할 수 있습니다.</small>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector("#closePasskeyBtn").addEventListener("click", () => panel.remove());
    panel.querySelector("#createPasskeyBtn").addEventListener("click", async () => {
      const button = panel.querySelector("#createPasskeyBtn");
      button.disabled = true;
      button.textContent = "기기에서 확인하세요…";
      try {
        await createPasskey(account);
        showPasskeyPanel(account);
      } catch (error) {
        button.disabled = false;
        button.textContent = "패스키 만들기";
        alert(error.message || "패스키를 만들지 못했습니다.");
      }
    });
    panel.querySelectorAll("[data-del]").forEach((button) => {
      button.addEventListener("click", () => {
        savePasskeys(loadPasskeys().filter((item) => item.id !== button.dataset.del));
        showPasskeyPanel(account);
      });
    });
  }

  function mount() {
    document.body.classList.add("auth-locked");
    const box = document.createElement("div");
    box.id = "fontoryAuth";
    box.innerHTML = `
      <div class="auth-card">
        <div class="auth-mark">FONTORY · PRIVATE ACCESS</div>
        <h1>글꼴 보관소</h1>
        <p>등록된 계정 또는 패스키로 접속하세요.</p>
        <form id="authForm">
          <label>아이디<input id="authUser" autocomplete="username" required></label>
          <label>비밀번호<input id="authPass" type="password" autocomplete="current-password" required></label>
          <button type="submit">접속하기</button>
          <button id="passkeyButton" class="auth-passkey" type="button">패스키로 접속</button>
          <div id="authError" role="alert"></div>
        </form>
        <small>패스키가 없다면 아이디와 비밀번호로 접속한 뒤 오른쪽 위의 “패스키 만들기”를 누르세요.</small>
      </div>`;
    document.body.appendChild(box);
    document.querySelector("#authUser").focus();
    document.querySelector("#authForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      setError("");
      const user = document.querySelector("#authUser").value.trim();
      const password = document.querySelector("#authPass").value;
      const [userHash, passwordHash] = await Promise.all([hash(user), hash(password)]);
      if (USERS[userHash] && PASSWORDS[passwordHash]) {
        const account = { username: user, role: USERS[userHash].role };
        sessionStorage.setItem(KEY, JSON.stringify({ username: account.username, role: account.role, method: "password", authenticatedAt: Date.now() }));
        unlock(account);
        return;
      }
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    });
    document.querySelector("#passkeyButton").addEventListener("click", async () => {
      setError("");
      const button = document.querySelector("#passkeyButton");
      button.disabled = true;
      button.textContent = "패스키 확인 중…";
      try {
        const match = await loginWithPasskey();
        const account = { username: match.username, role: match.role };
        sessionStorage.setItem(KEY, JSON.stringify({ username: account.username, role: account.role, method: "passkey", authenticatedAt: Date.now() }));
        unlock(account);
      } catch (error) {
        setError(error.message || "패스키로 접속하지 못했습니다.");
        button.disabled = false;
        button.textContent = "패스키로 접속";
      }
    });
  }

  function unlock(account) {
    document.body.classList.remove("auth-locked");
    document.querySelector("#fontoryAuth")?.remove();
    document.querySelector("#fontoryPasskeyPanel")?.remove();
    document.querySelector(".auth-logout")?.remove();
    document.querySelector(".auth-passkey-manage")?.remove();
    const passkeyBtn = document.createElement("button");
    passkeyBtn.type = "button";
    passkeyBtn.className = "auth-passkey-manage";
    passkeyBtn.textContent = "패스키 만들기";
    passkeyBtn.addEventListener("click", () => showPasskeyPanel(account));
    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "auth-logout";
    logout.textContent = account.role === "admin" ? "관리자 · 로그아웃" : "로그아웃";
    logout.addEventListener("click", () => { sessionStorage.removeItem(KEY); location.reload(); });
    const topbar = document.querySelector(".topbar");
    if (topbar) { topbar.appendChild(passkeyBtn); topbar.appendChild(logout); }
  }

  const current = session();
  if (current?.role) {
    const account = { username: current.username || "account", role: current.role };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => unlock(account), { once: true });
    else unlock(account);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
