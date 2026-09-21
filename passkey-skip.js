(() => {
  const AUTH = "fontory-auth-v3";
  const PENDING = "fontory-auth-pending";
  const FLAG = "fontory-passkey-ok";

  try {
    const cur = JSON.parse(sessionStorage.getItem(AUTH) || "null");
    if (cur && cur.username === "passkey") sessionStorage.removeItem(AUTH);
  } catch {}

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

  function skipOnlyDailyForm() {
    if (sessionStorage.getItem(FLAG) !== "1") return;
    if (!document.querySelector("#dailyForm")) return;
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem(PENDING) || "null"); } catch {}
    if (!pending || pending.method !== "passkey") {
      sessionStorage.removeItem(FLAG);
      return;
    }
    sessionStorage.removeItem(PENDING);
    sessionStorage.removeItem(FLAG);
    sessionStorage.setItem(AUTH, JSON.stringify({
      username: pending.username,
      role: pending.role || "user",
      method: "passkey",
      date: todayKst(),
      authenticatedAt: Date.now()
    }));
    location.reload();
  }

  new MutationObserver(skipOnlyDailyForm).observe(document.documentElement, { childList: true, subtree: true });
})();
