(() => {
  const FALLBACK_MUSIC = {
    id: "default",
    name: "Fontory 기본 음악",
    file: "./assets/fontory-download-music.mp3?v=20260929-padded1",
  };
  const MANIFEST_URL = "./assets/fontory-music/index.json";
  const API_BASE = "https://fontory-api.fontory.workers.dev";
  let catalogPromise = null;
  let selectedPromise = null;

  const normalize = (item) => {
    if (!item || !item.id || !item.file) return null;
    return { id: String(item.id), name: String(item.name || item.id), file: String(item.file) };
  };

  async function loadCatalog() {
    try {
      const response = await fetch(MANIFEST_URL, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data.map(normalize).filter(Boolean) : [];
        if (list.length) return list;
      }
    } catch {}
    return [FALLBACK_MUSIC];
  }

  async function getCatalog() {
    if (!catalogPromise) catalogPromise = loadCatalog();
    return catalogPromise;
  }

  async function getSelected() {
    if (!selectedPromise) {
      selectedPromise = (async () => {
        try {
          const response = await fetch(API_BASE + "/api/music", { credentials: "include", cache: "no-store" });
          if (response.ok) {
            const data = await response.json();
            const direct = normalize(data.music || data.selected);
            if (direct) return direct;
            const id = data.musicId || data.selectedMusicId;
            if (id) {
              const catalog = await getCatalog();
              const found = catalog.find((entry) => entry.id === String(id));
              if (found) return found;
            }
          }
        } catch {}
        const catalog = await getCatalog();
        return catalog[0] || FALLBACK_MUSIC;
      })();
    }
    return selectedPromise;
  }

  window.fontoryGetMusicCatalog = getCatalog;
  window.fontoryGetSelectedMusic = getSelected;
  window.fontoryGetMusicUrl = async () => (await getSelected()).file;
  window.fontoryResetMusicCache = () => {
    catalogPromise = null;
    selectedPromise = null;
  };
})();
