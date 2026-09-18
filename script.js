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
  "영문·세리프·클래식","영문·세리프·기타","영문·산세리프·고딕","영문·산세리프·기타",
  "영문·스크립트·필기","영문·디스플레이·장식","영문·디스플레이·기타","영문·모노스페이스·코딩",
  "영문·한글/지역","영문·기타·기호","영문·기타·레거시"
]);

// Exact membership of the original 579-font English/Latin bucket.
const ENGLISH_LATIN_FONT_IDS = new Set([
  "font-0019",
  "font-0020",
  "font-0206",
  "font-0207",
  "font-0209",
  "font-0210",
  "font-0211",
  "font-0218",
  "font-0219",
  "font-0220",
  "font-0229",
  "font-0230",
  "font-0231",
  "font-0232",
  "font-0245",
  "font-0246",
  "font-0247",
  "font-0248",
  "font-0249",
  "font-0250",
  "font-0251",
  "font-0252",
  "font-0253",
  "font-0254",
  "font-0255",
  "font-0256",
  "font-0279",
  "font-0280",
  "font-0281",
  "font-0282",
  "font-0283",
  "font-0284",
  "font-0285",
  "font-0286",
  "font-0287",
  "font-0288",
  "font-0289",
  "font-0290",
  "font-0291",
  "font-0292",
  "font-0293",
  "font-0294",
  "font-0295",
  "font-0296",
  "font-0297",
  "font-0298",
  "font-0299",
  "font-0300",
  "font-0301",
  "font-0303",
  "font-0386",
  "font-0387",
  "font-0388",
  "font-0389",
  "font-0390",
  "font-0391",
  "font-0392",
  "font-0393",
  "font-0428",
  "font-0429",
  "font-0430",
  "font-0442",
  "font-0443",
  "font-0444",
  "font-0445",
  "font-0446",
  "font-0447",
  "font-0448",
  "font-0449",
  "font-0450",
  "font-0451",
  "font-0452",
  "font-0453",
  "font-0454",
  "font-0455",
  "font-0460",
  "font-0461",
  "font-0462",
  "font-0463",
  "font-0464",
  "font-0465",
  "font-0466",
  "font-0467",
  "font-0468",
  "font-0469",
  "font-0470",
  "font-0477",
  "font-0478",
  "font-0479",
  "font-0480",
  "font-0481",
  "font-0482",
  "font-0483",
  "font-0484",
  "font-0489",
  "font-0490",
  "font-0491",
  "font-0494",
  "font-0495",
  "font-0496",
  "font-0497",
  "font-0498",
  "font-0499",
  "font-0500",
  "font-0501",
  "font-0502",
  "font-0503",
  "font-0504",
  "font-0505",
  "font-0506",
  "font-0507",
  "font-0508",
  "font-0509",
  "font-0510",
  "font-0511",
  "font-0512",
  "font-0513",
  "font-0514",
  "font-0515",
  "font-0530",
  "font-0531",
  "font-0532",
  "font-0533",
  "font-0534",
  "font-0535",
  "font-0536",
  "font-0539",
  "font-0540",
  "font-0541",
  "font-0542",
  "font-0543",
  "font-0544",
  "font-0545",
  "font-0546",
  "font-0547",
  "font-0548",
  "font-0549",
  "font-0550",
  "font-0551",
  "font-0552",
  "font-0553",
  "font-0573",
  "font-0574",
  "font-0575",
  "font-0576",
  "font-0577",
  "font-0578",
  "font-0579",
  "font-0580",
  "font-0581",
  "font-0582",
  "font-0583",
  "font-0584",
  "font-0585",
  "font-0586",
  "font-0587",
  "font-0588",
  "font-0593",
  "font-0594",
  "font-0595",
  "font-0596",
  "font-0597",
  "font-0598",
  "font-0599",
  "font-0600",
  "font-0601",
  "font-0602",
  "font-0603",
  "font-0604",
  "font-0605",
  "font-0606",
  "font-0607",
  "font-0608",
  "font-0623",
  "font-0624",
  "font-0633",
  "font-0634",
  "font-0635",
  "font-0636",
  "font-0637",
  "font-0638",
  "font-0639",
  "font-0640",
  "font-0645",
  "font-0646",
  "font-0647",
  "font-0651",
  "font-0652",
  "font-0653",
  "font-0654",
  "font-0655",
  "font-0656",
  "font-0657",
  "font-0658",
  "font-0659",
  "font-0660",
  "font-0661",
  "font-0861",
  "font-0862",
  "font-0863",
  "font-0864",
  "font-0865",
  "font-0866",
  "font-0867",
  "font-0868",
  "font-0869",
  "font-0870",
  "font-0871",
  "font-0872",
  "font-0873",
  "font-0874",
  "font-0875",
  "font-0876",
  "font-0877",
  "font-0878",
  "font-0879",
  "font-0880",
  "font-0881",
  "font-0882",
  "font-0883",
  "font-0884",
  "font-0885",
  "font-0886",
  "font-0887",
  "font-0888",
  "font-0889",
  "font-0890",
  "font-0891",
  "font-0892",
  "font-0893",
  "font-0894",
  "font-0898",
  "font-0899",
  "font-0900",
  "font-0901",
  "font-0902",
  "font-0903",
  "font-0904",
  "font-0905",
  "font-0906",
  "font-0907",
  "font-0908",
  "font-0911",
  "font-0912",
  "font-0915",
  "font-0916",
  "font-0917",
  "font-0918",
  "font-0920",
  "font-0922",
  "font-0923",
  "font-0956",
  "font-0957",
  "font-0958",
  "font-0973",
  "font-0974",
  "font-0975",
  "font-0976",
  "font-0977",
  "font-0978",
  "font-0979",
  "font-0984",
  "font-0985",
  "font-0986",
  "font-0987",
  "font-0988",
  "font-0989",
  "font-0990",
  "font-0991",
  "font-0992",
  "font-0993",
  "font-0994",
  "font-0995",
  "font-0996",
  "font-0997",
  "font-0998",
  "font-0999",
  "font-1000",
  "font-1001",
  "font-1002",
  "font-1015",
  "font-1016",
  "font-1052",
  "font-1053",
  "font-1054",
  "font-1055",
  "font-1056",
  "font-1057",
  "font-1058",
  "font-1059",
  "font-1060",
  "font-1061",
  "font-1062",
  "font-1063",
  "font-1064",
  "font-1065",
  "font-1066",
  "font-1067",
  "font-1082",
  "font-1083",
  "font-1084",
  "font-1104",
  "font-1105",
  "font-1106",
  "font-1107",
  "font-1108",
  "font-1109",
  "font-1110",
  "font-1111",
  "font-1112",
  "font-1113",
  "font-1114",
  "font-1115",
  "font-1118",
  "font-1119",
  "font-1120",
  "font-1121",
  "font-1122",
  "font-1123",
  "font-1124",
  "font-1125",
  "font-1142",
  "font-1143",
  "font-1144",
  "font-1145",
  "font-1146",
  "font-1147",
  "font-1148",
  "font-1149",
  "font-1150",
  "font-1151",
  "font-1152",
  "font-1153",
  "font-1154",
  "font-1155",
  "font-1156",
  "font-1157",
  "font-1158",
  "font-1159",
  "font-1160",
  "font-1165",
  "font-1166",
  "font-1167",
  "font-1168",
  "font-1169",
  "font-1170",
  "font-1171",
  "font-1172",
  "font-1173",
  "font-1174",
  "font-1175",
  "font-1182",
  "font-1183",
  "font-1184",
  "font-1185",
  "font-1186",
  "font-1190",
  "font-1191",
  "font-1192",
  "font-1193",
  "font-1194",
  "font-1195",
  "font-1196",
  "font-1197",
  "font-1198",
  "font-1199",
  "font-1200",
  "font-1201",
  "font-1202",
  "font-1203",
  "font-1204",
  "font-1205",
  "font-1206",
  "font-1207",
  "font-1208",
  "font-1209",
  "font-1210",
  "font-1231",
  "font-1232",
  "font-1233",
  "font-1234",
  "font-1235",
  "font-1236",
  "font-1237",
  "font-1238",
  "font-1239",
  "font-1240",
  "font-1241",
  "font-1242",
  "font-1243",
  "font-1244",
  "font-1245",
  "font-1246",
  "font-1247",
  "font-1248",
  "font-1249",
  "font-1331",
  "font-1332",
  "font-1333",
  "font-1334",
  "font-1335",
  "font-1336",
  "font-1337",
  "font-1338",
  "font-1339",
  "font-1340",
  "font-1341",
  "font-1342",
  "font-1377",
  "font-1378",
  "font-1379",
  "font-1380",
  "font-1381",
  "font-1382",
  "font-1383",
  "font-1384",
  "font-1385",
  "font-1386",
  "font-1397",
  "font-1398",
  "font-1399",
  "font-1400",
  "font-1401",
  "font-1402",
  "font-1403",
  "font-1422",
  "font-1423",
  "font-1424",
  "font-1425",
  "font-1426",
  "font-1427",
  "font-1428",
  "font-1429",
  "font-1430",
  "font-1431",
  "font-1432",
  "font-1433",
  "font-1434",
  "font-1441",
  "font-1442",
  "font-1443",
  "font-1450",
  "font-1451",
  "font-1452",
  "font-1453",
  "font-1454",
  "font-1455",
  "font-1456",
  "font-1457",
  "font-1458",
  "font-1459",
  "font-1460",
  "font-1461",
  "font-1462",
  "font-1463",
  "font-1465",
  "font-1466",
  "font-1467",
  "font-1468",
  "font-1469",
  "font-1470",
  "font-1480",
  "font-1481",
  "font-1482",
  "font-1485",
  "font-1497",
  "font-1498",
  "font-1499",
  "font-1500",
  "font-1501",
  "font-1502",
  "font-1503",
  "font-1504",
  "font-1505",
  "font-1506",
  "font-1507",
  "font-1508",
  "font-1509",
  "font-1510",
  "font-1511",
  "font-1512",
  "font-1513",
  "font-1514",
  "font-1515",
  "font-1516",
  "font-1517",
  "font-1518",
  "font-1519",
  "font-1520",
  "font-1521",
  "font-1522",
  "font-1523",
  "font-1524",
  "font-1525",
  "font-1526",
  "font-1527",
  "font-1528",
  "font-1529",
  "font-1531",
  "font-1532",
  "font-1533",
  "font-1534",
  "font-1535",
  "font-1536",
  "font-1537",
  "font-1538",
  "font-1539",
  "font-1540",
  "font-1541",
  "font-1542",
  "font-1546",
  "font-1547",
  "font-1548",
  "font-1549",
  "font-1550",
  "font-1551",
  "font-1572",
  "font-1573",
  "font-1574",
  "font-1575",
  "font-1576",
  "font-1577",
  "font-1578",
  "font-1579",
  "font-1581",
  "font-1582",
  "font-1583",
  "font-1584",
  "font-1587",
  "font-1588",
  "font-1589",
  "font-1590",
  "font-1591",
  "font-1592",
  "font-1593",
  "font-1594",
  "font-1595",
  "font-1596",
  "font-1609",
  "font-1610",
  "font-1611",
  "font-1612",
  "font-1618",
  "font-1619",
  "font-1620",
  "font-1621",
  "font-1622",
  "font-1623",
  "font-1624",
  "font-1625",
  "font-1626",
  "font-1644",
  "font-1645",
  "font-1646",
  "font-1647",
  "font-1648",
  "font-1649",
  "font-1650",
  "font-1651",
  "font-1652",
  "font-1653",
  "font-1656",
  "font-1657",
  "font-1658",
  "font-1659",
  "font-1660",
  "font-1661",
  "font-1662",
  "font-1663",
  "font-1664",
  "font-1665",
  "font-1666",
  "font-1667",
  "font-1668",
  "font-1669",
  "font-1670",
  "font-1671",
  "font-1672",
  "font-1673"
]);

const CATEGORY_GROUPS = {
  "영문·라틴": (category, font) => ENGLISH_LATIN_FONT_IDS.has(String(font?.id || "")),
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
  return group ? group(String(font.category || ""), font) : font.category === category;
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
