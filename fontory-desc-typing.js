(() => {
  const BLURBS = [
    ["나눔고딕", "유래: 2008년 한글날, 네이버가 산돌에 많겨 만든 나눔 시리즈의 첫 글꼴이에요. 우분한 본문용 고딕으로 많이 쓰여요."],
    ["나눔명조", "유래: 네이버 나눔 시리즈의 책 글용 명조에요. 폰트릭스가 디자인했고, 긴 글에 잘 어울려요."],
    ["나눔스퀘어라운드", "유래: 네이버 나눔 시리즈의 둥근 스퀘어 고딕이에요. 제목과 화면 구분에 잘 어울려요."],
    ["나눔스퀘어", "유래: 네이버가 공개한 나눔 스퀘어에요. 들북들북한 가로형 고딕이에요."],
    ["나눔바른고딕", "유래: 네이버 나눔 시리즈. 화면에서 더 쉽게 읽히도록 다듬은 고딕이에요."],
    ["나눔바른펜", "유래: 네이버 나눔 손글씨 계열. 윤디자인이 만든 펜 글씨 느낌이에요."],
    ["나눔펜", "유래: 네이버가 공개한 나눔 손글씨 펜체에요. 손로 쓠 듯한 마르고 부드럽습니다."],
    ["나눔붓", "유래: 네이버 나눔 손글씨 붓글씨에요. 한글 붓 느낌이 강합니다."],
    ["나눔휴먼", "유래: 네이버 나눔 시리즈의 화면용 계열이에요."],
    ["나눔", "유래: 2008년 한글날 이후 네이버가 ‘한글을 아름닥게’ 캠페인으로 공개한 무료 글꼴이에요. 산돌·폰트릭스·윤디자인이 만들었어요."],
    ["1984대화나눔", "유래: 네이버 나눔 손글씨 계열 중 대화하는 느낌의 글꼴이에요."],
    ["학교안심", "유래: 한국교육학술정보원(KERIS)이 학교에서 저작권 걱정 없이 쓰도록 만들어 배포한 공공 글꼴이에요."],
    ["KERIS", "유래: 한국교육학술정보원이 교육 현장용으로 만든 글꼴이에요."],
    ["배민 한나", "유래: 우아한형제들(배달의민족)이 만든 한나는열한살체에요. 1970년대 간판 느낌에서 시작했어요."],
    ["배달의민족 한나", "유래: 우아한형제들이 브랜드를 알리려 공개한 배민 한나체에요. 옛날 간판 필체에서 나왔어요."],
    ["을지로", "유래: 배달의민족이 서울 을지로 간판에서 따온 글꼴이에요. 복고 느낌이 강합니다."],
    ["배민 도현", "유래: 우아한형제들이 공개한 배민 도현체에요. 두께운 고딕 느낌이에요."],
    ["배민 주아", "유래: 배달의민족이 만든 주아체에요. 둥근하고 친근한 느낌입니다."],
    ["배달의민족", "유래: 우아한형제들이 브랜드 폰트로 만들어 무료 공개한 글꼴이에요. 한나·도현·주아·을지로 계열이 있어요."],
    ["배민", "유래: 배달의민족(우아한형제들)이 공개한 글꼴이에요. 개성 있는 간판·봄퍼 느낌이 특징입니다."],
    ["카페24", "유래: 쇼핑몰 플랫폼 카페24가 웹사이트·디자인용으로 만들어 공개한 글꼴이에요."],
    ["서울남산", "유래: 서울시가 윤디자인에 많겨 만든 서울서체의 고딕입니다. 2008년부터 공공기물에 쓰였어요."],
    ["서울한강", "유래: 서울시 서울서체의 명조입니다. 한강의 흐름에서 이름을 떻았어요."],
    ["서울·서초", "유래: 서울 서초구가 공개한 지역 공공 글꼴이에요."],
    ["서울·은평", "유래: 서울 은평구가 공개한 지역 공공 글꼴이에요."],
    ["서울", "유래: 서울특별시가 시민투표로 꼲고 윤디자인이 제작한 공공 글꼴입니다. 남산체·한강체가 대표적이에요."],
    ["경기·고양", "유래: 고양시가 공개한 지역 글꼴이에요."],
    ["경기·여주", "유래: 여주시가 도자기를 모티프로 만든 공공 글꼴이에요."],
    ["경기·포천", "유래: 포천시가 공개한 지역 글꼴이에요."],
    ["경기", "유래: 경기도청이 공개한 공공 글꼴입니다. 경기천년체가 잘 알려 있어요."],
    ["제주", "유래: 제주특별자치도가 공개한 제주고딕·제주명조 계열입니다."],
    ["마포", "유래: 서울 마포구가 공개한 지역 글꼴입니다. 홍대·당인리 같은 마포 이름이 들어 있어요."],
    ["상주", "유래: 경북 상주시가 공개한 지역 글꼴입니다. 곡감·다정다감 계열이 있어요."],
    ["칠곡", "유래: 경북 칠곡군이 공개한 지역 글꼴입니다."],
    ["대구·수성", "유래: 대구 수성구가 공개한 수성돋움·수성바탕 계열입니다."],
    ["대구·달서", "유래: 대구 달서구가 공개한 지역 글꼴입니다."],
    ["강원", "유래: 강원특별자치도·시·군이 공개한 지역 글꼴입니다."],
    ["전북·전주", "유래: 전주시가 공개한 지역 글꼴입니다."],
    ["전북·완주", "유래: 완주군이 공개한 지역 글꼴입니다."],
    ["전남", "유래: 전라남도 지역에서 공개한 공공 글꼴입니다."],
    ["경남·사천", "유래: 경남 사천시가 항공을 모티프로 만든 글꼴입니다."],
    ["경남", "유래: 경남도 지역에서 공개한 공공 글꼴입니다."],
    ["경북", "유래: 경상북도 지역에서 공개한 공공 글꼴입니다."],
    ["부산", "유래: 부산광역시가 공개한 지역 글꼴입니다."],
    ["광주", "유래: 광주광역시가 공개한 지역 글꼴입니다."],
    ["KCC 김환기", "유래: 한국저작권위원회가 화가 김환기를 기념해 만든 글꼴입니다."],
    ["KCC 정범", "유래: 한국저작권위원회가 만든 KCC 정범체입니다."],
    ["KCC 손기정", "유래: 한국저작권위원회가 올림픽 선수 손기정을 기념해 만든 글꼴입니다."],
    ["KCC 안창호", "유래: 한국저작권위원회가 도산 안창호를 기념해 만든 글꼴입니다."],
    ["KCC", "유래: 한국저작권위원회가 문화예술·인물을 기념하며 공개한 글꼴입니다."],
    ["온글잎", "유래: 보이저엑스가 손글씨를 글꼴로 만든 온글잎 프로젝트입니다. 지역 청소년 글씨를 담은 계열도 있어요."],
    ["Spoqa", "유래: 스포카가 본고딕(Noto Sans CJK)을 다듬은 스포카 한 산스입니다. 화면 구분용으로 많이 쓰여요."],
    ["Noto", "유래: 구글이 세계 모든 문자를 담으려고 만든 Noto(노토) 계열입니다. 한글은 본고딕·본명조로도 불립니다."],
    ["Google Fonts", "유래: 구글 폰트가 무료 공개한 글꼴입니다. 웹과 앱에서 잘 쓰여요."],
    ["Pretendard", "유래: 길형진이 화면 가독을 위해 만든 한글 산세리프입니다. 웹사이트에서 많이 쓰여요."],
    ["Wanted Sans", "유래: 월트 산스는 화면용으로 다듬은 한글 산세리프입니다."],
    ["KoPubWorld", "유래: 한국출판인회의가 책 만들 때 쓰도록 만든 KoPub 세계 판 글꼴입니다."],
    ["KOTRA", "유래: 대한무역투자진흥공사(KOTRA)가 공개한 글꼴입니다."],
    ["G마켓", "유래: G마켓이 브랜드용으로 만들어 공개한 산스 글꼴입니다."],
    ["Tmoney", "유래: 티머니가 공개한 둥근 글꼴입니다. 교통카드 브랜드에서 나왔어요."],
    ["넷마블", "유래: 게임사 넷마블이 공개한 브랜드 글꼴입니다."],
    ["가비아", "유래: 도메인 회사 가비아가 공개한 글꼴입니다."],
    ["카카오", "유래: 카카오가 큰 글씨·작은 글씨 구분용으로 만들어 공개한 글꼴입니다."],
    ["한글재민", "유래: 한글재민체는 한글을 쉬게 쓰도록 만든 손글씨 풍 글꼴입니다."],
    ["김정철", "유래: 글꼴 디자이너 김정철이 만든 고딕 계열입니다."],
    ["한컴", "유래: 한글과컴퓨터 제품과 함께 쓰이던 글꼴입니다."],
    ["Microsoft", "유래: 마이크로소프트가 Windows에 넣어 배포한 글꼴입니다. 말은고딕·칼리브리 등이 여기 포함됩니다."],
    ["Malgun", "유래: 마이크로소프트가 Windows한글용으로 만든 말은 고딕입니다."],
    ["Segoe", "유래: 마이크로소프트 Windows·Office UI에 쓰인 Segoe 계열입니다."],
    ["IBM Plex", "유래: IBM이 공개한 글꼴 계열입니다. 화면과 문서에 고루 쓰이도록 만들었어요."],
    ["공공·한국장애인개발원", "유래: 한국장애인개발원이 읽기 쉬운 바로 만든 공공 글꼴입니다."],
    ["공공·한수원", "유래: 한국수력원자력공사가 공개한 글꼴입니다."],
    ["공공·국립공원", "유래: 국립공원공단이 공개한 글꼴입니다. 꽁미 계열도 있어요."],
    ["독립운동", "유래: 독립운동과 기념·기록을 남기려 만든 글꼴입니다."],
    ["문화재·전통", "유래: 전통 문화재·기록용으로 만든 글꼴입니다. 옷글씨 느낌이 남아 있어요."],
    ["손글씨", "유래: 사람 손글씨를 글꼴로 닮은 계열입니다. 편지와 일기에 잘 어울려요."],
    ["코딩", "유래: 개발자가 코드를 맞춰 보도록 만든 고정폭 글꼴입니다."],
    ["페이퍼로지", "유래: 페이퍼로지는 한글 화면용으로 다듬은 산세리프 글꼴입니다."],
    ["Min Sans", "유래: 민산스는 한글 화면용 산세리프 글꼴입니다."],
    ["귀여운", "유래: 둥근하고 가벼운 느낌을 살린 캐주얼 글꼴입니다."],
    ["명조", "유래: 책에서 오래 쓰인 한글 명조식 글꼴입니다. 긴 글에 잘 어울려요."],
    ["한국 기본", "유래: 한글 본문에 잘 어울리도록 모은 글꼴들입니다. 공공·기업 공개분이 많아요."]
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

  function cleanName(name) {
    return String(name || "이 글꼴").replace(/^\[폰트\]\s*/, "").replace(/\s*다운로드\s*$/, "").trim();
  }

  function describe(font) {
    const name = cleanName(font?.name);
    const hay = [font?.name, font?.family, font?.category, font?.style].filter(Boolean).join(" ");
    const hit = BLURBS.find(([key]) => hay.includes(key));
    const extra = hit ? hit[1] : "유래를 확정한 공공·기업 공개 글꼴로 보이며, 골라 담은 실제 파일이에요.";
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
        typingTimer = window.setTimeout(tick, index === 1 ? 80 : 28);
      }
    };
    tick();
  }

  function announce(font) {
    const text = describe(font);
    const title = document.querySelector("#downloadProgressTitle");
    if (title) title.textContent = cleanName(font?.name);
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
  style.textContent = `.fontory-download-note{margin-top:12px;min-height:40px;color:#d7d7dc;font-size:13px;font-weight:700;line-height:1.5}.fontory-download-note::after{content:"";display:inline-block;width:2px;height:.9em;margin-left:3px;vertical-align:-2px;background:#0a84ff;animation:typing-cursor .85s steps(1,end) infinite}`;
  document.head.appendChild(style);
})();
