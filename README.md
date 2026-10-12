# wedding

김보규, 염민지 모바일 청첩장. GitHub Pages 정적 호스팅용이다.

## 구조

```
index.html              페이지 본문 (이름, 일시, 장소, 연락처, 계좌 등 텍스트)
assets/css/style.css    스타일 (상단 :root 변수에 테마 색상)
assets/js/main.js       달력, 디데이, 갤러리, 공유 등 동작 (상단 CONFIG에 설정값)
images/main.jpg         메인 사진 (2:3 세로 비율 권장)
images/og.jpg           카카오톡/링크 공유 미리보기 이미지 (2:1 가로 비율 권장)
images/gallery/01.jpg   갤러리 사진 (01 ~ 15, 4:5 비율 권장)
```

## 사진 교체

지금 들어 있는 사진은 모두 회색 임시 이미지다. 같은 파일명으로 덮어쓰면 된다.
갤러리 장수를 바꾸려면 `assets/js/main.js`의 `CONFIG.galleryCount`를 함께 수정한다.

## 채워 넣어야 할 정보

`index.html`에서 아래 임시 값을 검색해서 바꾼다.

- 부모님 성함: `신랑아버지`, `신랑어머니`, `신부아버지`, `신부어머니`
- 연락처: `010-0000-0000`
- 계좌: `OO은행`, `000-0000-0000` (`data-copy` 속성 값도 같이 수정)
- 버스 노선: `노선 정보 추후 업데이트`

`assets/js/main.js`의 `CONFIG`에서 설정한다.

- `rsvpUrl`: 참석 의사 전달용 구글폼 주소
- `kakaoJsKey`: Kakao JavaScript 키. 카카오톡 공유와 카카오내비 길안내에 쓴다.
    - Kakao Developers에서 앱을 만들고 플랫폼 > Web에 `https://bohub12.github.io`, `http://localhost:8000`을 등록한다.
    - 카카오내비 길안내는 카카오내비 메뉴도 활성화해야 한다.
    - 비워두면 카카오맵 길찾기 웹 링크로 대체한다.
- `naverMapKeyId`: 네이버 지도 표시용 Client ID.
    - 네이버 클라우드 플랫폼 콘솔의 Maps > Application 등록에서 Dynamic Map을 선택한다.
    - Web 서비스 URL에 `https://bohub12.github.io`, `http://localhost:8000`을 등록한다.
    - 네이버 지도 웹페이지는 iframe 삽입을 막고 있어서(X-Frame-Options: DENY) 페이지 안에 지도를 띄우려면 이 키가 필요하다.
    - 비워두면 같은 좌표의 구글 지도(키 불필요)가 나온다.
- `venue`: 식장 이름과 좌표 (카카오맵 기준 더컨벤션 송파문정점, 37.48400527, 127.12278912)

네이버 지도와 티맵 버튼은 키 없이 동작한다. 모바일에서는 앱이 열리고, 앱이 없으면 웹이나 스토어로 넘어간다.

## 로컬 확인

```
python3 -m http.server 8000
```

## 배포

GitHub repo Settings > Pages에서 Source를 `main` 브랜치 `/ (root)`로 지정한다.
배포 주소는 https://bohub12.github.io/wedding/ 이고, `index.html`의 `og:image`, `og:url`도 이 주소 기준이다.
