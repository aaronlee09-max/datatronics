(function () {
  const ICONS = {
    "귀여운 둥근폰트": "🐣",
    "기본 한국폰트": "📖",
    "배달의민족": "🍽️",
    "독립서체": "🇰🇷",
    "개성폰트": "✨",
    "손글씨·캘리": "✍️",
    "학교안심": "🏫",
    "나눔폰트": "🌱",
    "카페24": "☕",
    "KCC": "🎨",
    "지역특화": "🗺️",
    "공공·전통": "🏛️",
    "브랜드·기업": "🏢",
    "코딩·모노": "💻",
    "영문·시스템": "🔤",
    "기타": "▦"
  };

  function inferGroup(font) {
    const c = String(font.category || "");
    const n = String(font.name || "") + " " + String(font.file || "");
    if (c.indexOf("배민 ") === 0 || c === "배달의민족" || n.indexOf("BM ") !== -1 || n.indexOf("배민") !== -1) return "배달의민족";
    if (c === "독립운동" || c.indexOf("독립") !== -1) return "독립서체";
    if (c.indexOf("학교안심") === 0 || c === "KERIS") return "학교안심";
    if (c.indexOf("카페24") === 0) return "카페24";
    if (c.indexOf("나눔") === 0 || c === "나눔폰트") return "나눔폰트";
    if (c.indexOf("KCC") === 0) return "KCC";
    if (c.indexOf("Microsoft") === 0 || / 계열$/.test(c) || ["Agency FB","Bahnschrift","Impact","Sylfaen","Dubai","Ebrima","Gadugi","Microsoft Sans Serif"].indexOf(c) !== -1) return "영문·시스템";
    if (c.indexOf("영문") === 0 || ["Google Fonts","Noto","Bodoni 계열","Franklin/Fraktur 계열"].indexOf(c) !== -1) return "영문·시스템";
    if (c.indexOf("코딩") !== -1 || c.indexOf("모노스페이스") !== -1 || c.indexOf("픽셀") !== -1) return "코딩·모노";
    if (c === "귀여운·캐주얼" || c.indexOf("둥근") !== -1 || c.indexOf("냥이") !== -1 || c.indexOf("멍이") !== -1 || c.indexOf("1984") !== -1) return "귀여운 둥근폰트";
    if (["손글씨·캘리그래피","온글잎","한글재민","김정철","나눔바른펜","나눔펜","나눔붓"].indexOf(c) !== -1) return "손글씨·캘리";
    if (["제목·디스플레이","안성탕면","STUNNING","초군·치킨스크래치"].indexOf(c) !== -1) return "개성폰트";
    if (["서울","경기","강원","경남","경북","전북","전남","충북","부산","제주","광주","대구","지역특화","상주","칠곡","마포"].some(function (k) { return c.indexOf(k) !== -1; })) return "지역특화";
    if (["공공","문화재","KOTRA"].some(function (k) { return c.indexOf(k) !== -1; })) return "공공·전통";
    if (["G마켓","카카오","넷마블","Tmoney","가비아","브랜드","함렛","페이퍼로지"].some(function (k) { return c.indexOf(k) !== -1; })) return "브랜드·기업";
    if (["한국 기본·본문","고딕·산세리프","명조·세리프","한컴","KoPubWorld","순수바탕","표진고딕","고신고딕","구름·산세리프","Spoqa","Wanted Sans","Min Sans","Asta Sans","Interop","자연산스","아사콤·고딕","눈누·기본고딕","프리젠테이션"].indexOf(c) !== -1) return "기본 한국폰트";
    return "기타";
  }

  if (window.CATEGORY_ICONS) {
    Object.keys(ICONS).forEach(function (k) { window.CATEGORY_ICONS[k] = ICONS[k]; });
  }

  const origFetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    const href = String(url && url.url ? url.url : url);
    if (href.indexOf("fonts.json") === -1) return origFetch(url, opts);
    return origFetch(url, opts).then(function (res) {
      return res.clone().json().then(function (data) {
        if (!Array.isArray(data)) return res;
        data.forEach(function (font) {
          font.subcategory = font.subcategory || font.category;
          font.group = font.group || inferGroup(font);
          font.category = font.group;
        });
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { "Content-Type": "application/json" }
        });
      }).catch(function () { return res; });
    });
  };
})();
