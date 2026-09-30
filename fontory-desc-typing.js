(() => {
  const BLURBS = [
    ["나눔고딕", "유래: 2008년 한글날 네이버가 공개한 나눔 시리즈의 첫 고딕이에요."],
    ["나눔명조", "유래: 네이버 나눔 시리즈의 책 글용 명조에요."],
    ["나눔스퀘어", "유래: 네이버가 공개한 가로형 고딕이에요."],
    ["나눔", "유래: 2008년 한글날 이후 네이버가 공개한 무료 글꼴이에요."],
    ["학교안심", "유래: KERIS가 학교에서 저작권 걱정 없이 쓰도록 만들어 배포한 글꼴이에요."],
    ["KERIS", "유래: 한국교육학술정보원이 교육 현장용으로 만든 글꼴이에요."],
    ["을지로", "유래: 배달의민족이 서울 을지로 간판에서 따온 글꼴이에요."],
    ["배달의민족", "유래: 우아한형제들이 브랜드 폰트로 만들어 공개한 글꼴이에요."],
    ["배민", "유래: 배달의민족(우아한형제들)이 공개한 글꼴이에요."],
    ["카페24", "유래: 카페24가 웹사이트·디자인용으로 만들어 공개한 글꼴이에요."],
    ["서울", "유래: 서울시가 윤디자인에 많겨 만든 공공 글꼴입니다. 남산체·한강체가 대표적이에요."],
    ["경기", "유래: 경기도청이 공개한 공공 글꼴입니다."],
    ["제주", "유래: 제주특별자치도가 공개한 제주고딕·제주명조 계열입니다."],
    ["마포", "유래: 서울 마포구가 공개한 지역 글꼴입니다."],
    ["KCC", "유래: 한국저작권위원회가 문화예술·인물을 기념하며 공개한 글꼴입니다."],
    ["온글잎", "유래: 보이저엑스가 손글씨를 글꼴로 만든 프로젝트입니다."],
    ["Spoqa", "유래: 스포카가 본고딕을 다듬은 스포카 한 산스입니다."],
    ["Noto", "유래: 구글이 세계 문자를 담으려고 만든 Noto 계열입니다."],
    ["Google Fonts", "유래: 구글 폰트가 공개한 글꼴입니다."],
    ["Pretendard", "유래: 화면 가독을 위해 만든 한글 산세리프입니다."],
    ["KoPubWorld", "유래: 한국출판인회의가 책용으로 만든 글꼴입니다."],
    ["G마켓", "유래: G마켓이 브랜드용으로 공개한 글꼴입니다."],
    ["Tmoney", "유래: 티머니 교통카드 브랜드에서 나온 글꼴입니다."],
    ["넷마블", "유래: 넷마블이 공개한 브랜드 글꼴입니다."],
    ["카카오", "유래: 카카오가 큰 글씨·작은 글씨용으로 공개한 글꼴입니다."],
    ["한컴", "유래: 한글과컴퓨터 제품과 함께 쓰이던 글꼴입니다."],
    ["Microsoft", "유래: 마이크로소프트가 Windows에 넣어 배포한 글꼴입니다."],
    ["독립운동", "유래: 독립운동을 기념·기록하려 만든 글꼴입니다."],
    ["손글씨", "유래: 사람 손글씨를 글꼴로 만든 계열입니다."],
    ["코딩", "유래: 코드를 맞춰 보도록 만든 고정폭 글꼴입니다."],
    ["귀여운", "유래: 둥근하고 가벼운 느낌의 글꼴입니다."],
    ["명조", "유래: 책에서 쓰인 한글 명조식 글꼴입니다."],
    ["한국 기본", "유래: 한글 본문용으로 모은 공공·기업 공개 글꼴입니다."]
  ];

  let currentDesc = "";
  let currentFamily = "";
  let hooked = false;

  function cleanName(name) {
    return String(name || "이 글꼴").replace(/^\[폰트\]\s*/, "").replace(/\s*다운로드\s*$/, "").trim();
  }

  function describe(font) {
    const name = cleanName(font && font.name);
    const hay = [font && font.name, font && font.family, font && font.category, font && font.style].filter(Boolean).join(" ");
    const hit = BLURBS.find(function(item) { return hay.indexOf(item[0]) !== -1; });
    const extra = hit ? hit[1] : "지금 받는 글꼴의 유래를 찾아 보여 드립니다.";
    return name + " — " + extra;
  }

  function fontFromCard(card) {
    if (!card) return null;
    const file = card.dataset.file || "";
    const list = Array.isArray(window.fonts) ? window.fonts : [];
    const found = list.find(function(item) { return item && item.file === file; });
    const nameNode = card.querySelector(".font-name");
    const name = nameNode && nameNode.textContent ? nameNode.textContent.trim() : "";
    const tag = card.querySelector(".tag");
    return found || { name: name || file.split("/").pop() || "글꼴", file: file, category: tag ? tag.textContent : "" };
  }

  function applyFaceToTitle() {
    const title = document.querySelector("#downloadProgressTitle");
    if (!title) return;
    if (currentFamily) title.style.fontFamily = '"' + currentFamily + '", sans-serif';
  }

  async function useDownloadingFont(font) {
    if (!font || !font.file) return;
    const family = "FontoryDownloading";
    try {
      const url = new URL(font.file, location.href).href;
      const face = new FontFace(family, "url(" + JSON.stringify(url) + ")", { display: "swap" });
      const loaded = await face.load();
      document.fonts.add(loaded);
      currentFamily = family;
      applyFaceToTitle();
    } catch (error) {}
  }

  function hookProgress() {
    if (hooked) return;
    if (typeof typeDownloadProgressMessage !== "function") return;
    hooked = true;
    const origType = typeDownloadProgressMessage;
    window.typeDownloadProgressMessage = function(text) {
      origType(currentDesc || text);
      applyFaceToTitle();
    };
  }

  function announce(font) {
    currentDesc = describe(font);
    hookProgress();
    const panel = document.querySelector("#downloadProgress");
    if (panel) panel.hidden = false;
    if (typeof typeDownloadProgressMessage === "function") typeDownloadProgressMessage(currentDesc);
    else {
      const title = document.querySelector("#downloadProgressTitle");
      if (title) title.textContent = currentDesc;
    }
    applyFaceToTitle();
    useDownloadingFont(font);
  }

  document.addEventListener("click", function(event) {
    const btn = event.target.closest && event.target.closest("a.download, button.download, #downloadWindows, #makeProfile");
    if (!btn) return;
    const font = fontFromCard(btn.closest(".font-card"));
    if (font) announce(font);
  }, true);

  const ready = setInterval(function() {
    hookProgress();
    if (hooked) clearInterval(ready);
  }, 80);
})();
