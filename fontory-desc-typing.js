(() => {
  const BLURBS = [
    ["나눔고딕", "2008년 한글날 네이버가 공개한 나눔 시리즈의 첫 고딕이에요."],
    ["나눔명조", "네이버 나눔 시리즈의 책 글용 명조예요."],
    ["나눔스퀘어", "네이버가 공개한 가로형 고딕이에요."],
    ["나눔", "2008년 한글날 이후 네이버가 공개한 무료 글꼴이에요."],
    ["학교안심", "KERIS가 학교에서 사용할 수 있도록 만든 교육용 글꼴이에요."],
    ["KERIS", "한국교육학술정보원이 교육 현장용으로 만든 글꼴이에요."],
    ["을지로", "배달의민족이 서울 을지로 간판에서 영감을 받아 만든 글꼴이에요."],
    ["배달의민족", "우아한형제들이 브랜드 폰트로 만들어 공개한 글꼴이에요."],
    ["배민", "배달의민족이 공개한 글꼴이에요."],
    ["카페24", "카페24가 웹사이트와 디자인용으로 공개한 글꼴이에요."],
    ["서울", "서울시가 공개한 공공 글꼴이에요."],
    ["경기", "경기도가 공개한 공공 글꼴이에요."],
    ["제주", "제주특별자치도가 공개한 제주고딕·제주명조 계열이에요."],
    ["마포", "서울 마포구가 공개한 지역 글꼴이에요."],
    ["KCC", "한국저작권위원회가 공개한 기념·공공 글꼴 계열이에요."],
    ["온글잎", "손글씨를 글꼴로 만든 프로젝트에서 나온 글꼴이에요."],
    ["Spoqa", "스포카가 본고딕을 다듬어 만든 스포카 한 산스 계열이에요."],
    ["Noto", "세계 여러 문자를 담기 위해 만든 Noto 계열이에요."],
    ["Google Fonts", "구글 폰트에서 공개한 글꼴이에요."],
    ["Pretendard", "화면에서 편하게 읽도록 설계한 한글 산세리프예요."],
    ["KoPubWorld", "한국출판인회의가 책과 출판 환경을 위해 만든 글꼴이에요."],
    ["G마켓", "G마켓이 브랜드용으로 공개한 글꼴이에요."],
    ["Tmoney", "티머니 브랜드에서 나온 글꼴이에요."],
    ["넷마블", "넷마블이 공개한 브랜드 글꼴이에요."],
    ["카카오", "카카오가 공개한 브랜드 글꼴이에요."],
    ["한컴", "한글과컴퓨터 제품과 함께 사용되어 온 글꼴이에요."],
    ["Microsoft", "마이크로소프트가 Windows와 함께 배포한 글꼴이에요."],
    ["독립운동", "독립운동을 기념하고 기록하기 위해 만든 글꼴이에요."],
    ["손글씨", "사람의 손글씨 느낌을 살려 만든 글꼴 계열이에요."],
    ["코딩", "코드의 정렬을 위해 만든 고정폭 글꼴 계열이에요."],
    ["귀여운", "둥글고 가벼운 분위기를 살린 글꼴이에요."],
    ["명조", "책 본문에서 많이 쓰인 명조 계열 글꼴이에요."],
    ["한국 기본", "한글 본문용으로 모은 공공·기업 공개 글꼴이에요."]
  ];

  let currentFont = null;
  let typingTimer = null;

  function cleanName(name) {
    return String(name || "이 글꼴").replace(/^\[폰트\]\s*/, "").replace(/\s*다운로드\s*$/, "").trim();
  }

  function getDescription(font) {
    const hay = [font && font.name, font && font.family, font && font.category, font && font.style].filter(Boolean).join(" ");
    const hit = BLURBS.find(function(item) { return hay.indexOf(item[0]) !== -1; });
    return hit ? hit[1] : "이 글꼴의 특징과 유래를 살펴보며 다운로드하고 있어요.";
  }

  function getPreview(font) {
    return String((font && font.preview) || "오늘도 예쁘게 기록해요").trim();
  }

  function fontFromCard(card) {
    if (!card) return null;
    const file = card.dataset.file || "";
    const list = typeof fonts !== "undefined" && Array.isArray(fonts) ? fonts : [];
    const found = list.find(function(item) { return item && item.file === file; });
    return found || {
      name: (card.querySelector(".font-name") && card.querySelector(".font-name").textContent.trim()) || file.split("/").pop() || "글꼴",
      file: file,
      family: card.dataset.family || "",
      category: (card.querySelector(".tag") && card.querySelector(".tag").textContent) || ""
    };
  }

  function typePreview(text) {
    const target = document.querySelector("#downloadProgressTitle");
    if (!target || !text) return;
    window.clearInterval(typingTimer);
    target.textContent = "";
    let index = 0;
    typingTimer = window.setInterval(function() {
      target.textContent = text.slice(0, ++index);
      if (index >= text.length) {
        window.clearInterval(typingTimer);
        typingTimer = null;
      }
    }, 48);
  }

  function applyCardPreviewFont(font) {
    const title = document.querySelector("#downloadProgressTitle");
    if (!title) return;
    const family = (font && (font.family || font.name)) || "";
    title.style.fontFamily = family ? '"' + family + '", sans-serif' : "inherit";
  }

  function announce(font) {
    if (!font) return;
    currentFont = font;
    const panel = document.querySelector("#downloadProgress");
    const name = document.querySelector("#downloadProgressFontName");
    const description = document.querySelector("#downloadProgressDescription");
    if (panel) panel.hidden = false;
    if (name) name.textContent = cleanName(font.name);
    if (description) description.textContent = getDescription(font);
    applyCardPreviewFont(font);
    typePreview(getPreview(font));
  }

  document.addEventListener("click", function(event) {
    const btn = event.target.closest && event.target.closest("button[data-single-download], a.download, #downloadWindows, #makeProfile");
    if (!btn) return;
    var font = fontFromCard(btn.closest(".font-card"));
    if (!font && (btn.id === "downloadWindows" || btn.id === "makeProfile")) {
      var list = typeof fonts !== "undefined" && Array.isArray(fonts) ? fonts : [];
      var chosen = typeof selected !== "undefined" && selected instanceof Set
        ? list.filter(function(item) { return selected.has(item && (item.id || item.file)); })
        : [];
      font = chosen[0] || null;
    }
    if (font) announce(font);
  }, true);
})();
