const CATEGORIES = [
  "전체",
  "독립운동",
  "나눔폰트",
  "1984대화나눔",
  "학교안심",
  "배달의민족",
  "카페24",
  "KCC",
  "카카오 작은글씨",
  "카카오 큰글씨",
  "G마켓",
  "Spoqa",
  "Tmoney",
  "Microsoft",
  "한국 기본·본문",
  "고딕·산세리프",
  "명조·세리프",
  "손글씨·캘리그래피",
  "귀여운·캐주얼",
  "제목·디스플레이",
  "서울",
  "경기·고양",
  "경남·고성",
  "광주",
  "전북·완주",
  "전북·전주",
  "강원·원주",
  "충북·대학",
  "경북·영양",
  "전남·지역특화",
  "문화재·전통",
  "공공·환경",
  "공공·기관",
  "영문·라틴",
  "모노스페이스",
  "픽셀·레트로",
  "기호·딩벳",
]
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
