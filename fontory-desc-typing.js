(() => {
  const BLURBS = [
    ["나눔", "읽기 쉬운 기본 본문용 글꼴이에요."],
    ["배달의민족", "배달의민족에서 공개한 개성 있는 글꼴이에요."],
    ["배민", "배달의민족에서 공개한 개성 있는 글꼴이에요."],
    ["학교안심", "학교에서 쓰기 쉬게 만든 안심 글꼴이에요."],
    ["카페24", "카페24에서 공개한 웹·디자인용 글꼴이에요."],
    ["독립", "독립운동과 관련된 기록·기념용 글꼴이에요."],
    ["손글씨", "손맛 나는 필기체 느낌의 글꼴이에요."],
    ["캘리", "손맛 나는 필기체 느낌의 글꼴이에요."],
    ["귀여운", "부드럽고 가벼운 느낌의 글꼴이에요."],
    ["캐주얼", "부드럽고 가벼운 느낌의 글꼴이에요."],
    ["명조", "책과 긴 글에 잘 어울리는 세리프 글꼴이에요."],
    ["세리프", "책과 긴 글에 잘 어울리는 세리프 글꼴이에요."],
    ["고딕", "화면과 제목에 잘 어울리는 산세리프 글꼴이에요."],
    ["산세리프", "화면과 제목에 잘 어울리는 산세리프 글꼴이에요."],
    ["코딩", "코드를 보기 쉬게 맞춘 고정폭 글꼴이에요."],
    ["모노", "코드를 보기 쉬게 맞춘 고정폭 글꼴이에요."],
    ["Microsoft", "Windows와 함께 쓰이던 기본 글꼴이에요."],
    ["서울", "서울시에서 공개한 공공 글꼴이에요."],
    ["경기", "경기도 관련 공공·지역 글꼴이에요."],
    ["Pretendard", "화면용으로 많이 쓰는 산세리프 글꼴이에요."],
    ["Noto", "여러 문자를 폭넓게 담은 글꼴이에요."]
  ];

  let typingTimer = 0;
  let noteEl = null;

  function ensureNote() {
    if (noteEl && noteEl.isConnected) return noteEl;
    noteEl = document.createElement("div");
    noteEl.id = "fontoryDownloadNote";
    noteEl.className = "fontory-download-note";
    noteEl.hidden = true;
    const card = document.querySelector("#downloadProgress .download-progress-card") || document.querySelector("#selectionBar > div");
    if (card) card.appendChild(noteEl);
    else document.body.appendChild(noteEl);
    return noteEl;
  }

  function describe(font) {
    const name = String(font?.name || "이 글꼴").trim();
    const hay = [font?.name, font?.family, font?.category, font?.style].filter(Boolean).join(" ");
    const hit = BLURBS.find(([key]) => hay.includes(key));
    const extra = hit ? hit[1] : "골라 담은 실제 글꼴 파일이에요.";
    return name + " — " + extra;
  }

  function typeText(el, text) {
    window.clearTimeout(typingTimer);
    el.hidden = false;
    el.textContent = "";
    let index = 0;
    const tick = () => {
      el.textContent = text.slice(0, index);
      if (index < text.length) {
        index += 1;
        typingTimer = window.setTimeout(tick, index === 1 ? 160 : 38);
      }
    };
    tick();
  }

  function announce(font) {
    const text = describe(font);
    const title = document.querySelector("#downloadProgressTitle");
    if (title) title.textContent = text;
    typeText(ensureNote(), text);
  }

  function fontFromEventTarget(target) {
    const card = target && target.closest && target.closest(".font-card");
    if (!card) return null;
    const file = card.dataset.file || "";
    const list = Array.isArray(window.fonts) ? window.fonts : [];
    const found = list.find((item) => item && item.file === file);
    const name = card.querySelector(".font-name")?.textContent?.trim();
    return found || { name: name || file.split("/").pop() || "글꼴", file, category: card.querySelector(".tag")?.textContent || "" };
  }

  document.addEventListener("click", (event) => {
    const btn = event.target.closest && event.target.closest("a.download, button.download, #downloadWindows, #makeProfile");
    if (!btn) return;
    const font = fontFromEventTarget(btn);
    if (font) announce(font);
    else if (btn.id === "downloadWindows" || btn.id === "makeProfile") {
      const names = document.querySelector("#selectedNames")?.textContent || "";
      announce({ name: names.split("·")[0]?.replace(/\d+개 선택/, "").trim() || "선택한 글꼴", category: "" });
    }
  }, true);

  const style = document.createElement("style");
  style.textContent = `.fontory-download-note{margin-top:10px;min-height:18px;color:#d7d7dc;font-size:13px;font-weight:700;line-height:1.45}.fontory-download-note::after{content:"";display:inline-block;width:2px;height:.9em;margin-left:3px;vertical-align:-2px;background:#0a84ff;animation:typing-cursor .85s steps(1,end) infinite}`;
  document.head.appendChild(style);
})();
