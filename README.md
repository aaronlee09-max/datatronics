# iPhone Fonts

`datatronics`는 iPhone용 한국 폰트 라이브러리 사이트입니다.

배포 주소: https://softronics.run.place  
저장소: https://github.com/aaronlee09-max/datatronics

## 현재 상태

- 사이트 골격, 검색, 카테고리, 바구니, `.mobileconfig` 생성기는 배포되어 있습니다.
- **원본 폰트 ZIP은 현재 GitHub 저장소 트리에서 확인되지 않았습니다.**
  - `아카이브 (1).zip`
  - `아카이브 (2).zip`
  - `안심글꼴_폰트폴더에파일붙여넣기.zip`
- 그래서 `fonts.json`에는 다운로드 가능한 파일이 아직 없습니다.
- iPhone 실제 설치는 **테스트 필요** 상태입니다. 완성으로 표시하지 않습니다.

## 폴더 구조

```
/
├── CNAME
├── README.md
├── index.html
├── styles.css
├── script.js
├── fonts.json
├── fonts/
│   ├── 귀여운_둥근폰트/
│   ├── 기본_한국폰트/
│   ├── 배달의민족/
│   ├── 독립서체/
│   ├── 개성폰트/
│   └── 기타/
└── manifest/
    └── fonts-manifest.json
```

## 사용 방법

1. 폰트 이름 또는 카테고리로 검색합니다.
2. 미리보기에서 한글 / 영문 / 숫자를 확인합니다.
3. 담기 체크박스로 바구니에 넣습니다.
4. **모바일 구성 만들기**로 `.mobileconfig`를 받습니다.
5. iPhone에서 설정 → 프로파일 다운로드됨 → 설치 경로로 진행합니다.

## 모바일 구성 규격

생성기는 Apple Device Management `com.apple.font` 페이로드를 사용합니다.

- 키: `Font` (base64 폰트 바이너리), `Name`
- 지원 확장자: `.ttf`, `.otf`
- 컬렉션(`.ttc`, `.otc`)은 Apple 문서상 지원되지 않아 제외합니다.

실제 iPhone에서 설치·적용이 확인되기 전까지는 테스트 필요 상태입니다.

## 폰트 파일을 넣는 방법

원본 ZIP은 삭제하지 말고 별도로 보관하세요.  
폰트 파일만 `fonts/` 카테고리 폴더에 복사한 뒤 `fonts.json`과 `manifest/fonts-manifest.json`을 갱신합니다.

라이선스가 확인되지 않은 폰트를 무료라고 표시하지 않습니다.
