const CATEGORY_ICONS = {
  "전체": "✦",
  "독립운동": "🇰🇷",
  "나눔폰트": "🌱",
  "1984대화나눔": "💬",
  "학교안심": "🏫",
  "배달의민족": "🍽️",
  "카페24": "☕",
  "KCC": "🎨",
  "G마켓": "🛒",
  "Spoqa": "◉",
  "Tmoney": "🚇",
  "Microsoft": "▦",
  "Microsoft·산세리프": "▥",
  "Microsoft·세리프": "📜",
  "Microsoft·장식": "✨",
  "Microsoft·기호": "🔣",
  "Microsoft·동아시아": "🌏",
  "Microsoft·코딩": "⌨️",
  "한국 기본·본문": "📖",
  "고딕·산세리프": "▥",
  "명조·세리프": "📜",
  "손글씨·캘리그래피": "✍️",
  "귀여운·캐주얼": "🐣",
  "제목·디스플레이": "🔠",
  "서울": "🏙️",
  "경기·고양": "🏙️",
  "경남·고성": "🌊",
  "광주": "🌆",
  "전북·완주": "🌿",
  "전북·전주": "🏯",
  "강원·원주": "⛰️",
  "충북·대학": "🎓",
  "경북·영양": "🥬",
  "전남·지역특화": "🌾",
  "문화재·전통": "🏛️",
  "공공·환경": "🏛️",
  "브랜드·기업": "🏢",
  "안성탕면": "🍜",
  "프리젠테이션": "🎤",
  "함렛": "📚",
  "페이퍼로지": "📄",
  "KOTRA": "🌐",
  "온글잎": "🖋️",
  "KERIS": "🎓",
  "김정철": "🖌️",
  "KoPubWorld": "📘",
  "순수바탕": "📰",
  "표진고딕": "▥",
  "상주": "🏞️",
  "칠곡": "🌳",
  "고신고딕": "⛪",
  "코딩폰트": "💻",
  "코딩·개발": "⌨️",
  "모노스페이스": "▤",
  "픽셀·레트로": "👾",
  "기호·딩벳": "🔣",
  "영문·세리프·클래식": "🏛️",
  "영문·세리프·기타": "🔤",
  "영문·산세리프·고딕": "▥",
  "영문·산세리프·기타": "🔤",
  "영문·스크립트·필기": "✍️",
  "영문·디스플레이·장식": "✨",
  "영문·디스플레이·기타": "🎨",
  "영문·모노스페이스·코딩": "⌨️",
  "영문·한글/지역": "🌏",
  "영문·기타·기호": "🔣",
  "영문·기타·레거시": "🗃️",
  "Pretendard": "🅿️",
  "IBM Plex": "🧩",
  "Noto": "◉",
  "SUIT·SUITE": "🧵",
  "Google Fonts": "🔤",
  "마포": "🌉",
  "가비아": "🟣",
  "넷마블": "🎮",
  "JS·지역서체": "🗺️",
  "경기·지역특화": "📍",
  "강원·지역특화": "⛰️",
  "부산·지역특화": "🌊",
  "경남·지역특화": "🌊",
  "경북·지역특화": "🌳",
  "공공·지역특화": "🏛️",
  "공공·한국장애인개발원": "♿",
  "공공·한수원": "⚡",
  "공공·국립공원": "🏞️",
  "서울·은평": "🏙️",
  "서울·서초": "🏙️",
  "대구·달서": "🏙️",
  "한글재민": "✍️",
  "경남·김해": "🌿",
  "충북·진천": "🌾",
  "전남·완도": "🌊",
  "전남·순천": "🌿",
  "경기·양평": "🌳",
  "경기·양주": "🏞️",
  "경북·영주": "🌳",
  "강원·속초": "🌊",
  "강원·횡성": "🐄",
  "강원·태백": "⛰️",
  "강원·하이원": "⛷️",
  "한컴": "💻",
  "MV Boli 계열": "✍️",
  "Perpetua 계열": "📜",
  "Hightower Text 계열": "📜",
  "Constantia 계열": "📜",
  "Californian FB 계열": "📜",
  "Malgun Gothic 계열": "🪟"
};
const FONTORY_EXTRA_CATEGORY_ICONS = {
  "제주·지역특화": "🌴",
  "경기·여주": "🏺",
  "경기·포천": "🏯",
  "경남·사천": "✈️",
  "대구·수성": "🌳",
};
Object.assign(CATEGORY_ICONS, FONTORY_EXTRA_CATEGORY_ICONS);
const FONTORY_FAMILY_ICONS = {
  "770 발사체": "🚀",
  "Asta Sans": "⭐",
  "Agency FB": "🏢",
  "Arial 계열": "🔤",
  "Bahnschrift": "▤",
  "Baskerville 계열": "📜",
  "Bell MT 계열": "🔔",
  "Berlin Sans 계열": "🏙️",
  "Bodoni 계열": "🖋️",
  "Book Antiqua 계열": "📚",
  "Bookman 계열": "📖",
  "Calibri 계열": "🔤",
  "Calisto MT 계열": "📜",
  "Candara 계열": "🔤",
  "Centaur 계열": "🐎",
  "Century 계열": "📜",
  "Century Gothic 계열": "🔤",
  "Corbel 계열": "🔤",
  "Courier 계열": "⌨️",
  "Dubai": "🏙️",
  "Ebrima": "🔤",
  "Franklin/Fraktur 계열": "📰",
  "Gadugi": "🔤",
  "Garamond 계열": "📜",
  "Gill Sans 계열": "🔤",
  "Goudy 계열": "🎨",
  "Interop": "🔤",
  "Klei": "✨",
  "Leelawadee 계열": "🔤",
  "Lucida Bright 계열": "🔤",
  "Lucida Fax 계열": "🔤",
  "Lucida Typewriter 계열": "⌨️",
  "Microsoft Sans Serif": "🪟",
  "Min Sans": "🔤",
  "Nirmala UI 계열": "🔤",
  "Noto": "◉",
  "Orbit": "🪐",
  "STUNNING": "✨",
  "Scholastic 계열": "📚",
  "Segoe UI 계열": "🪟",
  "Segoe Print 계열": "✍️",
  "Segoe Script 계열": "✒️",
  "Sylfaen": "🔤",
  "Tahoma 계열": "🔤",
  "Times 계열": "📜",
  "Trebuchet MS 계열": "🌳",
  "Verdana 계열": "🔤",
  "Wanted Sans": "🎯",
  "구름·산세리프": "☁️",
  "구름·코딩": "☁️",
  "눈누·기본고딕": "👀",
  "아사콤·고딕": "🔤",
  "자연산스": "🌿",
  "초군·치킨스크래치": "🐔"
};
Object.assign(CATEGORY_ICONS, FONTORY_FAMILY_ICONS);

const ENGLISH_LATIN_CATEGORIES = new Set([
  "1984대화나눔",
  "Classic Serif",
  "G마켓",
  "Impact",
  "KCC",
  "KCC 간판",
  "KCC 김환기",
  "KCC 김훈",
  "KCC 무럭무럭",
  "KCC 손기정",
  "KCC 안창호",
  "KCC 은영",
  "KCC 임권택",
  "KCC 정범",
  "KCC 차쌈",
  "KCC 한빛",
  "KERIS",
  "KOTRA",
  "KoPubWorld",
  "Microsoft",
  "Spoqa",
  "Tmoney",
  "강원·원주",
  "경기·고양",
  "경남·고성",
  "경북·영양",
  "고딕·산세리프",
  "고신고딕",
  "공공·환경",
  "광주",
  "귀여운·캐주얼",
  "기호·딩벳",
  "김정철",
  "나눔고딕",
  "나눔명조",
  "나눔바른고딕",
  "나눔바른펜",
  "나눔붓",
  "나눔스퀘어",
  "나눔스퀘어라운드",
  "나눔펜",
  "나눔폰트",
  "나눔휴먼",
  "독립운동",
  "명조·세리프",
  "모노스페이스",
  "문화재·전통",
  "배민 기랑해랑",
  "배민 꾸불림",
  "배민 도현",
  "배민 연성",
  "배민 을지로",
  "배민 을지로 오래오래",
  "배민 을지로10년후",
  "배민 주아",
  "배민 한나 Air",
  "배민 한나 Pro",
  "배민 한나11",
  "브랜드·기업",
  "상주",
  "서울",
  "손글씨·캘리그래피",
  "순수바탕",
  "안성탕면",
  "영문·라틴",
  "온글잎",
  "전남·지역특화",
  "전북·완주",
  "전북·전주",
  "제목·디스플레이",
  "충북·대학",
  "칠곡",
  "카카오 작은글씨",
  "카카오 큰글씨",
  "카페24 BeHappy",
  "카페24 OhSquare",
  "카페24 PROSlim",
  "카페24 PROUP",
  "카페24 냥이",
  "카페24 단정해",
  "카페24 당당해",
  "카페24 데코",
  "카페24 동동",
  "카페24 러빙유",
  "카페24 멍이",
  "카페24 모야모야",
  "카페24 샤이닝스타",
  "카페24 숑숑",
  "카페24 슈퍼매직",
  "카페24 심플해",
  "카페24 써라운드",
  "카페24 쑥쑥",
  "카페24 앙바나나",
  "카페24 어느예쁜밤",
  "카페24 클래식타입",
  "코딩·개발",
  "코딩폰트",
  "페이퍼로지",
  "표진고딕",
  "프리젠테이션",
  "픽셀·레트로",
  "학교안심",
  "학교안심 공룡알",
  "학교안심 그림일기",
  "학교안심 기다리풍선",
  "학교안심 나들이",
  "학교안심 날개",
  "학교안심 둥근미소",
  "학교안심 떡볶이",
  "학교안심 마니또",
  "학교안심 몽당분필",
  "학교안심 민들레홀씨",
  "학교안심 바다쓰기",
  "학교안심 반달",
  "학교안심 별빛하늘",
  "학교안심 별자리",
  "학교안심 보드마카",
  "학교안심 상장",
  "학교안심 색연필",
  "학교안심 수수깡",
  "학교안심 스케치북",
  "학교안심 시간표",
  "학교안심 알림장",
  "학교안심 어항꾸미기",
  "학교안심 오카리나",
  "학교안심 자연",
  "학교안심 자유시간",
  "학교안심 책갈피",
  "학교안심 출석부",
  "학교안심 칠판지우개",
  "학교안심 퍼즐",
  "학교안심 포스터",
  "한국 기본·본문",
  "함렛"
]);

const CATEGORY_GROUPS = {
  "영문·라틴": (category) => ENGLISH_LATIN_CATEGORIES.has(category),
  "나눔폰트": (category) => category === "나눔폰트" || category.startsWith("나눔"),
  "학교안심": (category) => category === "학교안심" || category.startsWith("학교안심 "),
  "배달의민족": (category) => category === "배달의민족" || category.startsWith("배민 "),
  "카페24": (category) => category === "카페24" || category.startsWith("카페24 "),
  "KCC": (category) => category === "KCC" || category.startsWith("KCC "),
  "Microsoft": (category) => category === "Microsoft" || category.startsWith("Microsoft·"),
  "Google Fonts": (category) => category === "Google Fonts",
};

const CATEGORIES = [
  "전체",
  "영문·라틴",
  "독립운동",
  "나눔폰트",
  "1984대화나눔",
  "학교안심",
  "배달의민족",
  "카페24",
  "KCC",
  "G마켓",
  "Spoqa",
  "Tmoney",
  "Microsoft",
  "Microsoft·산세리프",
  "Microsoft·세리프",
  "Microsoft·장식",
  "Microsoft·기호",
  "Microsoft·동아시아",
  "Microsoft·코딩",
  "한국 기본·본문",
  "고딕·산세리프",
  "명조·세리프",
  "손글씨·캘리그래피",
  "귀여운·캐주얼",
  "제목·디스플레이",
  "서울",
  "경기·고양",
  "경기·여주",
  "경기·포천",
  "경남·고성",
  "경남·사천",
  "광주",
  "제주·지역특화",
  "전북·완주",
  "전북·전주",
  "강원·원주",
  "충북·대학",
  "경북·영양",
  "전남·지역특화",
  "문화재·전통",
  "공공·환경",
  "브랜드·기업",
  "안성탕면",
  "프리젠테이션",
  "함렛",
  "페이퍼로지",
  "KOTRA",
  "온글잎",
  "KERIS",
  "김정철",
  "KoPubWorld",
  "순수바탕",
  "표진고딕",
  "상주",
  "칠곡",
  "고신고딕",
  "코딩폰트",
  "코딩·개발",
  "모노스페이스",
  "픽셀·레트로",
  "기호·딩벳",
  "770 발사체",
  "Asta Sans",
  "Agency FB",
  "Arial 계열",
  "Bahnschrift",
  "Baskerville 계열",
  "Bell MT 계열",
  "Berlin Sans 계열",
  "Bodoni 계열",
  "Book Antiqua 계열",
  "Bookman 계열",
  "Calibri 계열",
  "Calisto MT 계열",
  "Candara 계열",
  "Centaur 계열",
  "Century 계열",
  "Century Gothic 계열",
  "Corbel 계열",
  "Courier 계열",
  "Dubai",
  "Ebrima",
  "Franklin/Fraktur 계열",
  "Gadugi",
  "Garamond 계열",
  "Gill Sans 계열",
  "Goudy 계열",
  "Interop",
  "Klei",
  "Leelawadee 계열",
  "Lucida Bright 계열",
  "Lucida Fax 계열",
  "Lucida Typewriter 계열",
  "Microsoft Sans Serif",
  "Min Sans",
  "Nirmala UI 계열",
  "Orbit",
  "STUNNING",
  "Scholastic 계열",
  "Segoe UI 계열",
  "Segoe Print 계열",
  "Segoe Script 계열",
  "Sylfaen",
  "Tahoma 계열",
  "Times 계열",
  "Trebuchet MS 계열",
  "Verdana 계열",
  "Wanted Sans",
  "구름·산세리프",
  "구름·코딩",
  "눈누·기본고딕",
  "아사콤·고딕",
  "자연산스",
  "초군·치킨스크래치",
  "영문·세리프·클래식",
  "영문·세리프·기타",
  "영문·산세리프·고딕",
  "영문·산세리프·기타",
  "영문·스크립트·필기",
  "영문·디스플레이·장식",
  "영문·디스플레이·기타",
  "영문·모노스페이스·코딩",
  "영문·한글/지역",
  "영문·기타·기호",
  "영문·기타·레거시",
  "Pretendard",
  "IBM Plex",
  "Noto",
  "SUIT·SUITE",
  "Google Fonts",
  "마포",
  "가비아",
  "넷마블",
  "JS·지역서체",
  "경기·지역특화",
  "강원·지역특화",
  "전남·지역특화",
  "부산·지역특화",
  "경남·지역특화",
  "경북·지역특화",
  "공공·지역특화",
  "공공·한국장애인개발원",
  "공공·한수원",
  "공공·국립공원",
  "서울·은평",
  "서울·서초",
  "대구·달서",
  "대구·수성",
  "한글재민",
  "경남·김해",
  "충북·진천",
  "전남·완도",
  "전남·순천",
  "경기·양평",
  "경기·양주",
  "경북·영주",
  "강원·속초",
  "강원·횡성",
  "강원·태백",
  "강원·하이원",
  "한컴",
  "MV Boli 계열",
  "Perpetua 계열",
  "Hightower Text 계열",
  "Constantia 계열",
  "Californian FB 계열",
  "Malgun Gothic 계열",
];

// Expose every category that belongs to the historical 579-font English/Latin set.
for (const cat of ENGLISH_LATIN_CATEGORIES) {
  if (!CATEGORIES.includes(cat)) CATEGORIES.push(cat);
}

const GITHUB_LFS_BASE = "https://media.githubusercontent.com/media/aaronlee09-max/datatronics/main/";
const FONT_ASSET_BASES = [
  GITHUB_LFS_BASE,
  "https://raw.githubusercontent.com/aaronlee09-max/datatronics/main/",
];
let fonts = [];
const selected = new Set();
let activeCategory = "전체";
const loadedFaces = new Set();
const failedFaces = new Set();
const PAGE_SIZE = 36;
let page = 1;

const grid = document.querySelector("#fontGrid");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const search = document.querySelector("#search");
const categoryBar = document.querySelector("#categoryBar");
const statusBanner = document.querySelector("#statusBanner");
const pagination = document.querySelector("#pagination");

function fontId(font) {
  return font.id || font.file || font.name;
}

function fileExtension(font) {
  return String(font.file || "").split(".").pop().toLowerCase();
}

function canInstall(font) {
  return ["ttf", "otf"].includes(fileExtension(font));
}

function windowsInstallable(font) {
  return ["ttf", "otf", "ttc", "otc"].includes(fileExtension(font));
}

function selectable(font) {
  return windowsInstallable(font);
}

function webPreviewable(font) {
  return ["ttf", "otf", "woff", "woff2"].includes(fileExtension(font));
}

function fontFormat(font) {
  const ext = fileExtension(font);
  return ({
    ttf: "truetype",
    otf: "opentype",
    woff: "woff",
    woff2: "woff2",
  })[ext] || ext;
}

function assetUrl(font) {
  if (!font.file) return "";
  return new URL(font.file, GITHUB_LFS_BASE).href;
}

function previewFamily(font) {
  return `FontoryPreview-${fontId(font).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function windowsDownloadLabel(font) {
  return windowsInstallable(font) ? "🪟 Windows 다운로드" : "Windows 다운로드";
}

function categoryMatches(font, category) {
  if (category === "전체") return true;
  const group = CATEGORY_GROUPS[category];
  return group ? group(String(font.category || "")) : font.category === category;
}

function categoryCount(category) {
  return fonts.filter((font) => categoryMatches(font, category)).length;
}

function renderCategories() {
  categoryBar.innerHTML = CATEGORIES
    .map((cat) => ({ cat, n: categoryCount(cat) }))
    .filter(({ cat, n }) => cat === "전체" || n > 0)
    .map(({ cat, n }) => {
      return `<button class="chip ${activeCategory === cat ? "active" : ""}" type="button" data-cat="${escapeAttr(cat)}">${CATEGORY_ICONS[cat] || "•"} ${escapeHtml(cat)} ${n}</button>`;
    }).join("");
  categoryBar.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      page = 1;
      render();
    });
  });
}

function matchesQuery(font, q) {
  if (!q) return true;
  const hay = `${font.name} ${font.family || ""} ${font.style || ""} ${font.category || ""}`.toLowerCase();
  return hay.includes(q);
}

function render() {
  renderCategories();
  const q = search.value.trim().toLowerCase();
  const filtered = fonts.filter((f) => categoryMatches(f, activeCategory) && matchesQuery(f, q));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  page = Math.min(page, pages);
  const list = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  count.textContent = `${filtered.length} fonts · ${page} / ${pages}`;
  empty.hidden = filtered.length !== 0;
  empty.textContent = fonts.length ? "검색 결과가 없습니다." : "등록된 폰트 파일이 아직 없습니다.";

  grid.innerHTML = list.map((f) => {
    const id = fontId(f);
    const preview = f.preview || "오늘도 예쁘게 기록해요";
    const face = f.family || f.name;
    const ext = fileExtension(f);
    const previewState = failedFaces.has(f.file) ? "preview-failed" : "";
    const windowsHelp = windowsInstallable(f)
      ? "Windows: 다운로드 후 파일 우클릭 → 설치"
      : ext === "woff" || ext === "woff2"
        ? "웹폰트 파일: 브라우저/CSS용으로 사용할 수 있습니다."
        : "파일을 다운로드해 용도에 맞게 사용하세요.";
    return `<article class="font-card ${selected.has(id) ? "selected" : ""}" data-id="${escapeAttr(id)}" data-file="${escapeAttr(f.file || "")}" data-family="${escapeAttr(face)}">
      <label class="select-row">
        <input class="font-check" type="checkbox" data-id="${escapeAttr(id)}" ${selected.has(id) ? "checked" : ""} ${selectable(f) ? "" : "disabled"}>
        <span>골라 담기</span>
      </label>
      <div class="font-meta">
        <span class="font-name">${escapeHtml(f.name)}</span>
        <span class="tag">${escapeHtml(f.category || "기타")}</span>
      </div>
      <div class="preview-stack">
        <div class="preview ${previewState}" data-preview="ko">${escapeHtml(preview)}</div>
        <div class="preview-sub ${previewState}" data-preview="mix">가나다 ABC 123</div>
      </div>
      <div class="font-info">${escapeHtml([f.family, f.style].filter(Boolean).join(" · ") || "실제 폰트 파일을 적용해 미리봅니다.")}<br><span class="windows-help">${escapeHtml(windowsHelp)}</span></div>
      <div class="actions">
        ${f.file && windowsInstallable(f)
          ? `<a class="download" href="${escapeAttr(assetUrl(f))}" download="${escapeAttr(f.file.split("/").pop() || f.name)}">${windowsDownloadLabel(f)}</a>`
          : f.file
            ? `<a class="download" href="${escapeAttr(assetUrl(f))}" target="_blank" rel="noopener">파일 열기</a>`
            : `<button class="download" type="button" disabled>파일 없음</button>`}
        <button class="details" type="button" data-copy="${escapeAttr(f.name)}">이름 복사</button>
      </div>
    </article>`;
  }).join("");

  pagination.hidden = filtered.length <= PAGE_SIZE;
  pagination.innerHTML = pagination.hidden ? "" : `
    <button type="button" data-page="prev" ${page === 1 ? "disabled" : ""}>이전</button>
    <span>${page} / ${pages}</span>
    <button type="button" data-page="next" ${page === pages ? "disabled" : ""}>다음</button>`;
  pagination.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      page += button.dataset.page === "next" ? 1 : -1;
      render();
      document.querySelector(".section-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  grid.querySelectorAll(".font-check").forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) selected.add(box.dataset.id);
      else selected.delete(box.dataset.id);
      render();
    });
  });
  grid.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.textContent;
        btn.textContent = "복사됨 ✓";
        setTimeout(() => { btn.textContent = old; }, 1000);
      } catch {}
    });
  });

  applyVisiblePreviews(list);
  updateBuilder();
}

async function loadFontFace(font) {
  if (!font.file || !webPreviewable(font)) return false;
  const key = font.file;
  if (loadedFaces.has(key)) return true;
  if (failedFaces.has(key)) return false;

  try {
    const family = previewFamily(font);
    const source = `url("${assetUrl(font)}") format("${fontFormat(font)}")`;
    const face = new FontFace(family, source, {
      style: "normal",
      weight: "400",
      display: "swap",
    });
    const loaded = await face.load();
    document.fonts.add(loaded);
    if (loaded.status !== "loaded") throw new Error("font face failed");
    loadedFaces.add(key);
    return true;
  } catch (error) {
    failedFaces.add(key);
    console.warn("Font preview failed:", font.name, error);
    return false;
  }
}

function applyVisiblePreviews(list) {
  list.filter(webPreviewable).forEach(async (font) => {
    const ok = await loadFontFace(font);
    if (ok) styleCards(font);
    else markPreviewFailed(font);
  });
}

function styleCards(font) {
  const family = previewFamily(font);
  grid.querySelectorAll(".font-card").forEach((card) => {
    if (card.dataset.file === font.file) {
      card.querySelectorAll("[data-preview]").forEach((el) => {
        el.classList.remove("preview-failed");
        el.style.fontFamily = `"${family}", sans-serif`;
      });
    }
  });
}

function markPreviewFailed(font) {
  grid.querySelectorAll(".font-card").forEach((card) => {
    if (card.dataset.file === font.file) {
      card.querySelectorAll("[data-preview]").forEach((el) => {
        el.classList.add("preview-failed");
        el.textContent = "실제 폰트 미리보기 로드 실패";
      });
    }
  });
}

function updateBuilder() {
  const bar = document.querySelector("#selectionBar");
  const names = document.querySelector("#selectedNames");
  const iphoneBtn = document.querySelector("#makeProfile");
  const windowsBtn = document.querySelector("#downloadWindows");
  if (!bar || !names || !iphoneBtn || !windowsBtn) return;

  const chosen = fonts.filter((f) => selected.has(fontId(f)) && selectable(f));
  const chosenWindows = chosen.filter(windowsInstallable);
  const chosenIphone = chosen.filter(canInstall);

  bar.hidden = chosen.length === 0;
  names.textContent = chosen.length
    ? `${chosen.length}개 선택 · ${chosen.map((f) => f.name).join(", ")}`
    : "";
  iphoneBtn.disabled = chosenIphone.length === 0;
  windowsBtn.disabled = chosenWindows.length === 0;
}

async function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
}

async function fetchFontBlob(font) {
  const response = await fetch(assetUrl(font), { mode: "cors", credentials: "omit", cache: "force-cache" });
  if (!response.ok) throw new Error(`${font.name}: 폰트 파일을 불러오지 못했습니다 (${response.status}).`);
  const blob = await response.blob();
  if (blob.size < 1024) throw new Error(`${font.name}: 실제 폰트 데이터가 아닌 파일이 반환되었습니다.`);
  return blob;
}

async function downloadSelectedWindows() {
  const chosen = fonts.filter((f) => selected.has(fontId(f)) && windowsInstallable(f));
  if (!chosen.length) return;

  if (chosen.length > 1) {
    const ok = confirm(`${chosen.length}개의 Windows 폰트를 차례로 다운로드할까요? 브라우저에서 여러 다운로드 허용을 요청할 수 있습니다.`);
    if (!ok) return;
  }

  const button = document.querySelector("#downloadWindows");
  const oldText = button.textContent;
  button.disabled = true;
  try {
    for (const font of chosen) {
      const blob = await fetchFontBlob(font);
      const filename = font.file.split("/").pop() || `${font.name}.${fileExtension(font)}`;
      await downloadBlob(blob, filename);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } finally {
    button.disabled = false;
    button.textContent = oldText;
  }
}

async function makeMobileConfig() {
  const chosen = fonts.filter((f) => selected.has(fontId(f)) && canInstall(f));
  if (!chosen.length) return;
  if (chosen.length > 20) {
    const ok = confirm(`선택한 iPhone 폰트가 ${chosen.length}개입니다. 큰 프로파일은 생성·설치가 실패할 수 있습니다. 계속할까요?`);
    if (!ok) return;
  }

  const payloads = [];
  const rejected = [];
  for (const font of chosen) {
    try {
      const blob = await fetchFontBlob(font);
      if (blob.size > 8 * 1024 * 1024) {
        rejected.push(`${font.name} (8MB 초과)`);
        continue;
      }

      const family = `FontoryValidation-${fontId(font).replace(/[^a-zA-Z0-9_-]/g, "-")}`;
      const testFace = new FontFace(family, await blob.arrayBuffer(), {
        style: "normal",
        weight: "400",
      });
      const loaded = await testFace.load();
      if (loaded.status !== "loaded") throw new Error("폰트 데이터가 브라우저에서 유효하지 않습니다.");

      const base64 = await blobToBase64(blob);
      payloads.push({
        name: font.name,
        fileName: font.file.split("/").pop() || `${font.name}.ttf`,
        data: wrapBase64(base64),
      });
    } catch (error) {
      rejected.push(`${font.name} (${error.message})`);
    }
  }

  if (!payloads.length) {
    throw new Error("유효한 iPhone용 폰트를 찾지 못했습니다. 선택한 폰트 파일을 확인해 주세요.");
  }

  const profileUuid = uuid();
  const fontXml = payloads.map((p) => {
    const id = uuid();
    return `<dict>
      <key>Font</key>
      <data>${p.data}</data>
      <key>Name</key>
      <string>${escapeXml(p.fileName)}</string>
      <key>PayloadDisplayName</key>
      <string>${escapeXml(p.name)}</string>
      <key>PayloadIdentifier</key>
      <string>fontory.iphone-fonts.font.${id}</string>
      <key>PayloadType</key>
      <string>com.apple.font</string>
      <key>PayloadUUID</key>
      <string>${id}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
    </dict>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>${fontXml}</array>
  <key>PayloadDescription</key>
  <string>Fontory에서 실제 폰트 데이터를 검증한 후 생성한 iPhone용 구성 프로파일입니다.</string>
  <key>PayloadDisplayName</key>
  <string>Fontory · 선택한 iPhone 폰트</string>
  <key>PayloadIdentifier</key>
  <string>fontory.iphone-fonts.${profileUuid}</string>
  <key>PayloadOrganization</key>
  <string>Fontory</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${profileUuid}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

  const blob = new Blob([xml], { type: "application/x-apple-aspen-config" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Fontory-iPhone-Fonts.mobileconfig";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);

  if (rejected.length) {
    setTimeout(() => alert(`유효하지 않아 제외된 폰트 ${rejected.length}개:\n\n${rejected.join("\n")}`), 100);
  }
}

function wrapBase64(data) {
  return data.replace(/(.{76})/g, "$1\n");
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function escapeAttr(value) { return escapeHtml(value); }
function escapeXml(value) { return String(value).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
}[c])); }

search.addEventListener("input", () => { page = 1; render(); });
document.querySelector("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("font-theme", document.body.classList.contains("dark") ? "dark" : "light");
});
document.querySelector("#makeProfile").addEventListener("click", () => {
  makeMobileConfig().catch((error) => alert(error.message));
});
document.querySelector("#downloadWindows").addEventListener("click", () => {
  downloadSelectedWindows().catch((error) => alert(error.message));
});
if (localStorage.getItem("font-theme") === "dark") document.body.classList.add("dark");

async function init() {
  try {
    const response = await fetch("./fonts.json", { cache: "no-store" });
    if (!response.ok) throw new Error("fonts.json을 불러오지 못했습니다.");
    const data = await response.json();
    fonts = Array.isArray(data) ? data : [];
    if (!fonts.length) {
      statusBanner.hidden = false;
      statusBanner.textContent = "원본 폰트 ZIP이 저장소에서 확인되지 않아 카드에 연결할 파일이 없습니다. 폰트 파일을 fonts/ 아래 카테고리 폴더에 넣은 뒤 fonts.json을 갱신하면 목록이 채워집니다.";
    }
    render();
  } catch (error) {
    fonts = [];
    count.textContent = "0 fonts";
    empty.hidden = false;
    empty.textContent = "폰트 목록을 불러오지 못했습니다.";
    console.error(error);
  }
}

init();
