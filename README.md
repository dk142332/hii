# ☕ 바이브 카페 주문서

HTML / CSS / JavaScript만으로 만든 주문서 웹앱입니다. 빌드 과정이 없어서 바로 배포할 수 있어요.

## 파일 구성
- `index.html` : 화면 구조
- `style.css` : 디자인
- `script.js` : 금액 계산, 주문 처리, 엑셀 저장

## 내 컴퓨터에서 보기
`index.html` 파일을 더블클릭하면 브라우저에서 열립니다.

## GitHub에 올리기
1. github.com 에서 `New repository` → 이름 `vibe-cafe` → `Create repository`
2. 이 폴더에서 터미널을 열고 아래를 차례대로 입력 (`내아이디` 는 본인 GitHub 아이디)

```bash
git init
git add .
git commit -m "바이브 카페 주문서 첫 업로드"
git branch -M main
git remote add origin https://github.com/내아이디/vibe-cafe.git
git push -u origin main
```

## Vercel로 배포하기
1. vercel.com 에서 GitHub 계정으로 로그인
2. `Add New...` → `Project` → `vibe-cafe` 저장소 `Import`
3. 설정은 건드리지 않고 `Deploy` 클릭 (Framework Preset: Other)
4. 1분쯤 뒤 `https://vibe-cafe-xxxx.vercel.app` 주소가 생깁니다.

이후 코드를 고치고 `git add . → git commit → git push` 하면 Vercel이 자동으로 다시 배포합니다.
