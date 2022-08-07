const canvas5 = document.querySelector("canvas");
const ctx5 = canvas5.getContext("2d");

canvas5.height = 800;
canvas5.width = 800;
canvas5.style = "background-color: white; border-radius:15px";

///////////////////////////////////////////////////////////////////
// 클릭할때만 isPainting이 true일것

// stroke 굵기변경
const line_width = document.getElementById("line-width");
ctx5.lineWidth = line_width.value;
ctx5.lineCap = "round";

function onLineWithChange(event) {
  ctx5.lineWidth = event.target.value;
}

line_width.addEventListener("change", onLineWithChange);

// 색깔변경
const change_color = document.getElementById("color");

function colorChange(event) {
  ctx5.strokeStyle = event.target.value;
  ctx5.fillStyle = event.target.value;
}

change_color.addEventListener("change", colorChange);

// 색깔선택지
const option_color = Array.from(document.querySelectorAll(".color-option")); //어레이로만듬
// console.log(option_color);

function onColorClick(event) {
  ctx5.strokeStyle = event.target.dataset.color;
  ctx5.fillStyle = event.target.dataset.color;
  change_color.value = event.target.dataset.color;
}

option_color.forEach((color) => color.addEventListener("click", onColorClick));

// 버튼만들기
const mode_btn = document.querySelector("#mode-btn");

function changeMode() {
  if (mode_btn.innerText === "Fill") {
    mode_btn.innerText = "Stroke";
    // console.log(document.querySelectorAll("canvas").width);
  } else if (mode_btn.innerText === "Stroke") {
    mode_btn.innerText = "Fill";
  }
}

mode_btn.addEventListener("click", changeMode);

// 전부다 채우는 함수
function onCanvasClick() {
  if (mode_btn.innerText === "Fill") {
    ctx5.fillRect(0, 0, canvas5.width, canvas5.height);
  }
}

// 지우는 버튼
const erase_btn = document.querySelector("#erase-btn");
const destroy_btn = document.querySelector("#destroy-btn");

function eraseMode() {
  change_color.value = "#FFFFFF";
  ctx5.strokeStyle = "#FFFFFF";
}

function destroyMode() {
  ctx5.fillStyle = "white";
  ctx5.fillRect(0, 0, canvas5.width, canvas5.height);
}

erase_btn.addEventListener("click", eraseMode);
destroy_btn.addEventListener("click", destroyMode);

let isPainting = false;

function onMove(event) {
  if (isPainting) {
    ctx5.lineTo(event.offsetX, event.offsetY);
    ctx5.stroke();
    // ctx5.fill();
    return; //함수를끝내기위해 리턴사용
  }
  ctx5.beginPath(); //선굵기 오류를 고치기위해 리셋처리
  ctx5.moveTo(event.offsetX, event.offsetY);
}
function startPainting() {
  isPainting = true;
}
function cancelPainting() {
  isPainting = false;
}

canvas5.addEventListener("mousemove", onMove);
canvas5.addEventListener("mousedown", startPainting);
canvas5.addEventListener("mouseup", cancelPainting);

// 마우스가 캔버스 밖으로 나갔을때 isPainting이 false가 되어야함
canvas5.addEventListener("mouseleave", cancelPainting);

// 다채우기 위한 옵션
canvas5.addEventListener("click", onCanvasClick);

//파일넣기
const fileInput = document.getElementById("file");

function onFileChange(event) {
  const file_ = event.target.files[0]; //파일선택
  const url_ = URL.createObjectURL(file_); //이미지 주소 가져오기
  const image = new Image();
  image.src = url_;
  //아래는 이거와 같음
  //img.addEventListener("onload", function);
  image.onload = function () {
    ctx5.drawImage(image, 0, 0, canvas5.width, canvas5.height);
    fileInput.value = null; //사진추가후 파일선택을 비우기위해
  };
}

fileInput.addEventListener("change", onFileChange);

//텍스트 추가하기
const textInput = document.getElementById("text_");
const font_size = document.getElementById("font_size");

function onDoubleClick(event) {
  if (textInput.value !== "") {
    //붓과 글씨의 굵기에서 문제가 생김
    ctx5.save(); //기존굵기저장
    ctx5.lineWidth = 1;
    let size = font_size.value;
    ctx5.font = `${size}px sans-serif`;
    ctx5.fillText(textInput.value, event.offsetX, event.offsetY);
    ctx5.restore(); //기존굵기 되살리기
  }
}

canvas5.addEventListener("dblclick", onDoubleClick);

//save
const save_btn = document.getElementById("save_btn");

function saveImage() {
  //이미지에대한 URL만들어준뒤
  //a속성으로 다 넣고 다운로드까지
  const url_image = canvas5.toDataURL();
  const a = document.createElement("a");
  a.href = url_image;
  a.download = "result.png";
  a.click();
}

save_btn.addEventListener("click", saveImage);
