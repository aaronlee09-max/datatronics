(()=> {
  const USERS = {
    "76671c0f8ca2aa9f898af7d22da44e1136ceea025348147859f59b9bc905a": {
      role: "admin"
    },
    "414cb10fdc75ee2a9853bbcf8c93c8cf3888de2e66c6a84307e1ff914ef3ffa8": {
      role: "user"
    },
    "00b0d881f3ca4cae478554ec2c5148e41f2cbd8528564c123a6ab8d8845ddc60": {
      role: "user"
    },
    "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": {
      role: "admin"
    }
  };

  const PASSWORDS = {
    "6280ab472481a292f4391e28f6f3c42c329dad577fd4afda33b2720f4a18b7f0": true,
    "40d354f5efb6114fab5a8df72caa4f836f527ad3b1d255a51dcb9f6836ae687a": true,
    "41d1fbe61da30ec3532e430faee074a6a7174332c6a07b623765a776a530bb34": true,
    "548a492529d0fa2943de0362cbc497bb252bada198526523a26739abe298d110": true
  };

  const KEY = "fontory-auth-v2";

  const hash = async (value) => {
    const bytes = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(value)
    );
    return [...new Uint8Array(bytes)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  };

  const session = () => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  };

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  function mount() {
    document.body.classList.add("auth-locked");

    const box = document.createElement("div");
    box.id = "fontoryAuth";
    box.innerHTML = `
      <div class="auth-card">
        <div class="auth-mark">FONTORY · PRIVATE ACCESS</div>
        <h1>글꼴 보관소</h1>
        <p>등록된 계정으로 접속하세요.</p>

        <form id="authForm">
          <label>
            아이디
            <input id="authUser" autocomplete="username" required>
          </label>

          <label>
            비밀번호
            <input id="authPass" type="password" autocomplete="current-password" required>
          </label>

          <button type="submit">접속하기</button>

          <button id="passkeyButton" class="auth-passkey" type="button">
            🔑 패스키로 접속
          </button>

          <div id="authError" role="alert"></div>
        </form>

        <small>
          패스키는 서버 측 WebAuthn 검증이 연결되면 활성화할 수 있습니다.
        </small>
      </div>
    `;

    document.body.appendChild(box);

    document.querySelector("#authUser").focus();

    document.querySelector("#authForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      const user = document.querySelector("#authUser").value.trim();
      const password = document.querySelector("#authPass").value;
      const error = document.querySelector("#authError");

      const [userHash, passwordHash] = await Promise.all([
        hash(user),
        hash(password)
      ]);

      if (USERS[userHash] && PASSWORDS[passwordHash]) {
        const account = USERS[userHash];
        sessionStorage.setItem(KEY, JSON.stringify({
          role: account.role,
          authenticatedAt: Date.now()
        }));
        unlock(account.role);
        return;
      }

      error.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    });

    document.querySelector("#passkeyButton").addEventListener("click", () => {
      document.querySelector("#authError").textContent =
        "패스키는 정식 WebAuthn 서버 검증을 연결한 뒤 사용할 수 있습니다.";
    });
  }

  function unlock(role) {
    document.body.classList.remove("auth-locked");
    document.querySelector("#fontoryAuth")?.remove();

    const logout = document.createElement("button");
    logout.type = "button";
    logout.className = "auth-logout";
    logout.textContent = role === "admin" ? "관리자 · 로그아웃" : "로그아웃";

    logout.addEventListener("click", () => {
      sessionStorage.removeItem(KEY);
      location.reload();
    });

    document.querySelector(".topbar")?.appendChild(logout);
  }

  const current = session();
  if (current?.role) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => unlock(current.role), { once: true });
    } else {
      unlock(current.role);
    }
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount, { once: true });
    } else {
      mount();
    }
  }
})();
