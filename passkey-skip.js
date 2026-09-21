(() => {
  const AUTH = "fontory-auth-v3";
  const PENDING = "fontory-auth-pending";
  const FLAG = "fontory-passkey-ok";
  const todayKst = () => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());

  if (navigator.credentials && typeof navigator.credentials.get === "function") {
    const origGet = navigator.credentials.get.bind(navigator.credentials);
    navigator.credentials.get = async function (opts) {
      const result = await origGet(opts);
      if (result && opts && opts.publicKey) sessionStorage.setItem(FLAG, "1");
      return result;
    };
  }

  function enter(account) {
    sessionStorage.removeItem(PENDING);
    sessionStorage.removeItem(FLAG);
    sessionStorage.setItem(AUTH, JSON.stringify({
      username: account.username || "passkey",
      role: account.role || "user",
      method: "passkey",
      date: todayKst(),
      authenticatedAt: Date.now()
    }));
    const box = document.querySelector("#fontoryAuth");
    if (box) box.remove();
    document.body.classList.remove("auth-locked");
    location.reload();
  }

  function skipCodeScreen() {
    if (sessionStorage.getItem(FLAG) !== "1") return;
    const box = document.querySelector("#fontoryAuth");
    if (!box) return;
    if (!/오늘 코드|DAILY CODE/.test(box.textContent || "")) return;
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(PENDING) || "null"); } catch {}
    enter(pending && pending.username ? pending : { username: "passkey", role: "user", method: "passkey" });
  }

  new MutationObserver(skipCodeScreen).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(skipCodeScreen, 200);
})();
