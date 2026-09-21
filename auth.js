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
  const ACCOUNTS = window.FONTORY_ACCOUNTS || {};
  const KEY = "fontory-auth-v3";
  const PASSKEY_KEY = "fontory-passkeys-v1";
  const PENDING_KEY = "fontory-auth-pending";
  const hash = async (value) => {
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  const todayKst = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const dailyCode = async () => {
    const [year, month, day] = todayKst().split("-");
    return year.slice(-2) + month + day;
  };
  const session = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; } };
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
  const setError = (text) => { const error = document.querySelector("#authError"); if (error) error.textContent = text || ""; };
  const randomBytes = (size) => crypto.getRandomValues(new Uint8Array(size));
  async function resolveAccount(user, password) {
    const [userHash, passwordHash] = await Promise.all([hash(user), hash(password)]);
    if (ACCOUNTS[userHash] && ACCOUNTS[userHash].pass === passwordHash) {
      return { username: user, role: ACCOUNTS[userHash].role, method: "password" };
    }
    if (USERS[userHash] && PASSWORDS[passwordHash]) {
      return { username: user, role: USERS[userHash].role, method: "password" };
    }
    return null;
  }
  function authShell(inner) {
    document.body.classList.add("auth-locked");
    document.querySelector("#fontoryAuth")?.remove();
    const box = document.createElement("div");
    box.id = "fontoryAuth";
    box.innerHTML = "<div class=\"auth-card\">" + inner + "</div>";
    document.body.appendChild(box);
  }
  async function createPasskey(account) {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키를 만들 수 없습니다. HTTPS와 최신 브라우저가 필요합니다.");
    const exclude = loadPasskeys().filter((item) => item.username === account.username).map((item) => ({ type: "public-key", id: fromB64(item.credentialId) }));
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { name: "Fontory", id: rpId() },
        user: { id: randomBytes(16), name: account.username, displayName: account.username },
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
      transports: credential.response.getTransports ? credential.response.getTransports() : []
    });
    savePasskeys(items);
    return items[items.length - 1];
  }
  async function loginWithPasskey() {
    if (!webauthnOk()) throw new Error("이 브라우저에서는 패스키 로그인을 사용할 수 없습니다.");
    const items = loadPasskeys();
    if (!items.length) throw new Error("등록된 패스키가 없습니다. 계정으로 접속한 뒤 패스키를 새로 만들어 주세요.");
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
    panel.innerHTML = '<div class="passkey-card"><strong>새 패스키 만들기</strong><p>' +
      (items.length ? ("이 계정에 패스키 " + items.length + "개가 있습니다.") : "아직 패스키가 없습니다. 지금 이 기기에 새 패스키를 만들 수 있습니다.") +
      '</p><div class="passkey-list">' +
      items.map((item) => '<div class="passkey-row"><span>' + new Date(item.createdAt).toLocaleString("ko-KR") + '</span><button type="button" data-del="' + item.id + '">삭제</button></div>').join("") +
      '</div><button type="button" id="createPasskeyBtn">이 기기에 패스키 새로 만들기</button><button type="button" id="closePasskeyBtn" class="passkey-close">닫기</button><small>Face ID, Touch ID, Windows Hello, 휴대폰 또는 보안 키를 사용할 수 있습니다. ' + rpId() + " 주소에서만 동작합니다.</small></div>";
    document.body.appendChild(panel);
    panel.querySelector("#closePasskeyBtn").addEventListener("click", () => panel.remove());
    panel.querySelector("#createPasskeyBtn").addEventListener("click", async () => {
      const button = panel.querySelector("#createPasskeyBtn");
      button.disabled = true;
      button.textContent = "기기에서 확인하세요…";
      try {
        await createPasskey(account);
        alert("패스키를 만들었습니다. 다음부터는 로그인 화면에서 패스키로 접속을 누르면 됩니다.");
        showPasskeyPanel(account);
      } catch (error) {
        button.disabled = false;
        button.textContent = "이 기기에 패스키 새로 만들기";
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
  function askDailyCode(account) {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(account));
    authShell('<div class="auth-mark">DAILY CODE</div><h1>오늘 코드 인증</h1><p>한국 시간 오늘 날짜 6자리를 입력하세요. 형식은 YYMMDD 입니다.</p><form id="dailyForm"><label>오늘 코드<input id="dailyCodeInput" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required></label><button type="submit">확인</button><button id="backLogin" class="auth-passkey" type="button">계정 로그인으로</button><div id="authError" role="alert"></div></form><small>예: 2026년 9월 21일 = 260921</small>');
    document.querySelector("#dailyCodeInput").focus();
    document.querySelector("#backLogin").addEventListener("click", () => {
      sessionStorage.removeItem(PENDING_KEY);
      mountLogin();
    });
    document.querySelector("#dailyForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      setError("");
      const typed = document.querySelector("#dailyCodeInput").value.replace(/\D/g, "");
      const expected = await dailyCode();
      if (typed !== expected) {
        setError("오늘 코드가 올바르지 않습니다. 날짜 6자리를 입력하세요.");
        return;
      }
      sessionStorage.removeItem(PENDING_KEY);
      sessionStorage.setItem(KEY, JSON.stringify({
        username: account.username,
        role: account.role,
        method: account.method,
        date: todayKst(),
        authenticatedAt: Date.now()
      }));
      unlock(account);
    });
  }
  function mountLogin() {
    authShell('<div class="auth-mark">FONTORY · PRIVATE ACCESS</div><h1>글꼴 보관소</h1><p>등록된 계정으로 접속하세요. 접속 후 오늘 날짜 코드와 패스키를 사용할 수 있습니다.</p><form id="authForm"><label>아이디<input id="authUser" autocomplete="username" required></label><label>비밀번호<input id="authPass" type="password" autocomplete="current-password" required></label><button type="submit">계정 로그인</button><button id="passkeyButton" class="auth-passkey" type="button">패스키로 접속</button><div id="authError" role="alert"></div></form><small>패스키가 없으면 계정 로그인 → 오늘 코드 → 오른쪽 위 패스키 만들기 순서로 진행하세요.</small>');
    document.querySelector("#authUser").focus();
    document.querySelector("#authForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      setError("");
      const user = document.querySelector("#authUser").value.trim();
      const password = document.querySelector("#authPass").value;
      const account = await resolveAccount(user, password);
      if (account) {
        askDailyCode(account);
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
        askDailyCode({ username: match.username, role: match.role, method: "passkey" });
      } catch (error) {
        setError(error.message || "패스키로 접속하지 못했습니다.");
        button.disabled = false;
        button.textContent = "패스키로 접속";
      }
    });
  }
  async function unlock(account) {
    document.body.classList.remove("auth-locked");
    document.querySelector("#fontoryAuth")?.remove();
    document.querySelector("#fontoryPasskeyPanel")?.remove();
    document.querySelector(".auth-logout")?.remove();
    document.querySelector(".auth-passkey-manage")?.remove();
    document.querySelector(".auth-daily-code")?.remove();
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;
    if (account.role === "admin") {
      const codeBtn = document.createElement("button");
      codeBtn.type = "button";
      codeBtn.className = "auth-daily-code";
      codeBtn.textContent = "오늘 코드";
      codeBtn.addEventListener("click", async () => {
        alert("오늘 코드는 " + (await dailyCode()) + " 입니다.");
      });
      topbar.appendChild(codeBtn);
    }
    const passkeyBtn = document.createElement("button");
    passkeyBtn.type = "button";
    passkeyBtn.className = "auth-passkey-manage";
    passkeyBtn.textContent = "패스키 만들기";
    passkeyBtn.addEventListener("click", () => showPasskeyPanel(account));
    topbar.appendChild(passkeyBtn);
    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "auth-logout";
    logout.textContent = account.role === "admin" ? "관리자 · 로그아웃" : "로그아웃";
    logout.addEventListener("click", () => {
      sessionStorage.removeItem(KEY);
      sessionStorage.removeItem(PENDING_KEY);
      location.reload();
    });
    topbar.appendChild(logout);
  }
  const current = session();
  if (current && current.role && current.date === todayKst()) {
    const account = { username: current.username || "account", role: current.role, method: current.method };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => unlock(account), { once: true });
    else unlock(account);
  } else {
    sessionStorage.removeItem(KEY);
    const start = () => {
      try {
        const pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null");
        if (pending && pending.username && pending.role) {
          askDailyCode(pending);
          return;
        }
      } catch {}
      mountLogin();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
  }
})();
