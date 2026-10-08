// ===== 화면 요소 가져오기 =====
const form = document.getElementById('orderForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const drinkSelect = document.getElementById('drink');
const quantityInput = document.getElementById('quantity');
const requestInput = document.getElementById('request');
const totalBox = document.getElementById('total');
const confirmBox = document.getElementById('confirm');

// ===== 현재 선택된 값 읽기 =====

// 선택한 사이즈 라디오 버튼
function getSelectedSize() {
  return document.querySelector('input[name="size"]:checked');
}

// 체크된 추가 옵션 목록
function getCheckedOptions() {
  return Array.from(document.querySelectorAll('input[name="options"]:checked'));
}

// 수량 (1~10 범위로 보정)
function getQuantity() {
  const qty = parseInt(quantityInput.value, 10);
  if (isNaN(qty) || qty < 1) return 1;
  if (qty > 10) return 10;
  return qty;
}

// ===== 금액 계산 =====
// (음료 가격 + 사이즈 추가금 + 옵션 추가금) x 수량
function calculateTotal() {
  const drinkPrice = Number(drinkSelect.selectedOptions[0].dataset.price);
  const sizePrice = Number(getSelectedSize().dataset.price);
  const optionsPrice = getCheckedOptions()
    .reduce((sum, opt) => sum + Number(opt.dataset.price), 0);

  return (drinkPrice + sizePrice + optionsPrice) * getQuantity();
}

// ===== 예상 금액 화면에 표시 =====
function updateTotal() {
  totalBox.textContent = '예상 금액: ' + calculateTotal().toLocaleString() + '원';
}

// 음료 / 사이즈 / 옵션 / 수량이 바뀔 때마다 금액 다시 계산
// (form 안의 어떤 값이 바뀌어도 실행됨)
form.addEventListener('change', updateTotal);
quantityInput.addEventListener('input', updateTotal);

// ===== 엑셀 파일로 저장 =====
function saveToExcel(order) {
  // 엑셀 한 줄(행)에 들어갈 데이터
  const row = {
    '주문일시': order.time,
    '이름': order.name,
    '전화번호': order.phone,
    '음료': order.drink,
    '사이즈': order.size,
    '추가옵션': order.options.join(', '),
    '수량': order.quantity,
    '요청사항': order.request,
    '총 금액(원)': order.total
  };

  const sheet = XLSX.utils.json_to_sheet([row]);   // 데이터 -> 시트
  const book = XLSX.utils.book_new();              // 새 엑셀 파일
  XLSX.utils.book_append_sheet(book, sheet, '주문');

  // 파일 이름: 주문_이름_날짜.xlsx
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(book, '주문_' + order.name + '_' + date + '.xlsx');
}

// ===== 주문하기 버튼 =====
form.addEventListener('submit', function (event) {
  event.preventDefault(); // 페이지가 새로고침되지 않도록 막기

  const name = nameInput.value.trim();

  // 입력 확인
  if (name === '') {
    alert('이름을 입력해주세요');
    nameInput.focus();
    return;
  }
  if (drinkSelect.value === '') {
    alert('음료를 선택해주세요');
    drinkSelect.focus();
    return;
  }

  // 주문 정보 정리
  const size = getSelectedSize().value;
  const options = getCheckedOptions().map(opt => opt.value);
  const quantity = getQuantity();
  const total = calculateTotal();

  // 주문 확인 메시지 만들기
  // 예) 홍길동님, 카페라떼 M사이즈 (샷 추가) 1잔, 총 5,000원 주문이 접수되었습니다!
  const optionText = options.length > 0 ? ' (' + options.join(', ') + ')' : '';
  confirmBox.textContent =
    name + '님, ' + drinkSelect.value + ' ' + size + '사이즈' + optionText +
    ' ' + quantity + '잔, 총 ' + total.toLocaleString() + '원 주문이 접수되었습니다!';
  confirmBox.hidden = false;

  // 엑셀 파일로 저장
  saveToExcel({
    time: new Date().toLocaleString('ko-KR'),
    name: name,
    phone: phoneInput.value.trim(),
    drink: drinkSelect.value,
    size: size,
    options: options,
    quantity: quantity,
    request: requestInput.value.trim(),
    total: total
  });
});

// ===== 다시 작성 버튼 =====
// 입력값은 브라우저가 자동으로 초기화하고, 금액과 메시지만 직접 초기화
form.addEventListener('reset', function () {
  confirmBox.hidden = true;
  confirmBox.textContent = '';
  // 초기화가 끝난 뒤에 금액 다시 계산
  setTimeout(updateTotal, 0);
});

// 처음 화면이 열릴 때 금액 표시
updateTotal();
