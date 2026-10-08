(() => {
  const FALLBACK_MUSIC = {
    id: "default",
    name: "Fontory 기본 음악",
    file: "./assets/fontory-download-music.mp3?v=20260929-padded1",
    durationMs: 206352,
  };
  const MANIFEST_URL = "./assets/fontory-music/index.json?v=20261008-duration";
  const DURATIONS_URL = "./assets/fontory-music/durations.json?v=20261008-duration";
  const API_BASE = "https://fontory-api.fontory.workers.dev";
  let catalogPromise = null;
  let settingsPromise = null;
  let durationsPromise = null;
  let downloadJobPromise = null;

  const normalize = (item, durations = null) => {
    if (!item || !item.id || !item.file) return null;
    const id = String(item.id);
    const durationMs = Number(durations?.[id] ?? item.durationMs);
    return {
      id,
      name: String(item.name || item.id),
      file: String(item.file),
      durationMs: Number.isSafeInteger(durationMs) && durationMs > 0 ? durationMs : null,
    };
  };

  async function loadDurations() {
    try {
      const response = await fetch(DURATIONS_URL, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === "object" && !Array.isArray(data)) return data;
      }
    } catch {}
    return {};
  }

  async function getDurations() {
    if (!durationsPromise) durationsPromise = loadDurations();
    return durationsPromise;
  }

  async function loadCatalog() {
    try {
      const [manifestResponse, durations] = await Promise.all([
        fetch(MANIFEST_URL, { cache: "no-store" }),
        getDurations(),
      ]);
      if (manifestResponse.ok) {
        const data = await manifestResponse.json();
        const list = Array.isArray(data) ? data.map((item) => normalize(item, durations)).filter(Boolean) : [];
        if (list.length) return list;
      }
    } catch {}
    return [FALLBACK_MUSIC];
  }

  async function getCatalog() {
    if (!catalogPromise) catalogPromise = loadCatalog();
    return catalogPromise;
  }

  async function getSettings() {
    if (!settingsPromise) {
      settingsPromise = (async () => {
        try {
          const response = await fetch(API_BASE + "/api/music", { credentials: "include", cache: "no-store" });
          if (response.ok) {
            const data = await response.json();
            return {
              loginMusicId: data.loginMusicId || data.musicId || data.selectedMusicId || null,
              downloadMode: data.downloadMode === "random" ? "random" : "admin-selected",
              downloadMusicId: data.downloadMusicId || data.downloadSelectedMusicId || null,
            };
          }
        } catch {}
        return { loginMusicId: null, downloadMode: "admin-selected", downloadMusicId: null };
      })();
    }
    return settingsPromise;
  }

  async function findMusic(id) {
    if (!id) return null;
    const catalog = await getCatalog();
    return catalog.find((entry) => entry.id === String(id)) || null;
  }

  async function getSelected() {
    const settings = await getSettings();
    return (await findMusic(settings.loginMusicId)) || (await getCatalog())[0] || FALLBACK_MUSIC;
  }

  async function selectDownloadMusicForJob() {
    if (!downloadJobPromise) {
      downloadJobPromise = (async () => {
        const settings = await getSettings();
        const catalog = await getCatalog();
        if (settings.downloadMode === "random" && catalog.length) {
          const index = crypto?.getRandomValues
            ? crypto.getRandomValues(new Uint32Array(1))[0] % catalog.length
            : Math.floor(Math.random() * catalog.length);
          return catalog[index] || FALLBACK_MUSIC;
        }
        if (settings.downloadMusicId) {
          const selected = await findMusic(settings.downloadMusicId);
          if (!selected) throw new Error(`선택한 다운로드 음악(${settings.downloadMusicId})을 목록에서 찾을 수 없습니다.`);
          return selected;
        }
        return catalog[0] || FALLBACK_MUSIC;
      })();
    }
    return downloadJobPromise;
  }

  function resetDownloadMusicJob() {
    downloadJobPromise = null;
  }

  window.fontoryGetMusicCatalog = getCatalog;
  window.fontoryGetMusicSettings = getSettings;
  window.fontoryGetSelectedMusic = getSelected;
  window.fontoryGetMusicUrl = async () => (await getSelected()).file;
  window.fontorySelectDownloadMusicForJob = selectDownloadMusicForJob;
  window.fontoryResetDownloadMusicJob = resetDownloadMusicJob;
  window.fontoryResetMusicCache = () => {
    catalogPromise = null;
    settingsPromise = null;
    durationsPromise = null;
    downloadJobPromise = null;
  };
})();
