const boardEl = document.getElementById("board");
const turnLabel = document.getElementById("turnLabel");
const modeSelect = document.getElementById("mode");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

let board = Array(9).fill(null);
let currentPlayer = "X";
let isGameOver = false;
let scores = { X: 0, O: 0, D: 0 };

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//! Oyun Başlatma

function init() {
  boardEl.innerHTML = "";
  board = Array(9).fill(null);
  isGameOver = false;
  currentPlayer = "X";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.dataset.index = i; //hücreye index ekleme
    cell.addEventListener("click", onCellClick); //Tıklama Eventi
    boardEl.appendChild(cell);
  }

  render();
  message.textContent = "Oyun Başladı";
}

//Hücrelere tıklma işlemi
function onCellClick(e) {
  const i = e.target.dataset.index; //hücrenin indexini alma
  if (board[i] || isGameOver) return; //hücre Dolu veya Oyun bittiyse işlem yapma
  board[i] = currentPlayer; //hücreye Oyuncunun işaretini koy
  render(); //görüntüyü güncelleme

  if (checkEnd()) return; //oyun bittiyse dur
  switchTurn(); //sıra değiş
  // Eğer bilgisayara karşı oynanıyorsa ve sıra "O" da ise
  if (modeSelect.value === "pvc" && currentPlayer === "O" && !isGameOver) {
    setTimeout(computerMove, 400); //0,4 saniye sonra PC hamlesini yapar
  }
}

//Bilgisayar hemlesi

function computerMove() {
  const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null); //boş hücreyi bul;
  if (empty.length === 0) return; // boş yer yoksa çık

  const move = empty[Math.floor(Math.random() * empty.length)]; //Rastgele Hücre seç
  board[move] = "O"; //O hemleyi yaapar

  render();

  if (checkEnd()) return;
  switchTurn();
}

//Sıra Değiştirme
function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnLabel.textContent = currentPlayer; //Ekranda göster
}
//Oyun Bitti mi

function checkEnd() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    // 3 hücrede aynıysa kazanan
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      isGameOver = true;
      message.textContent = `${board[a]} kazandı!`;
      scores[board[a]]++; //skoru arttır
      updateScore();
      return true;
    }
  }
  //Tüm hücreler Doluysa kazan yok -->Beraberlik

  if (board.every((cell) => cell)) {
    isGameOver = true;
    message.textContent = "Beraberlik";
    scores.D++;
    updateScore();
    return true;
  }
  return false;
}

//skor tablosu Güncelleme
function updateScore() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}
//Tahtayı Ekrana Çizme işlemi
function render() {
  Array.from(boardEl.children).forEach((cell, i) => {
    cell.textContent = board[i] || ""; //Hücre Boş değilse X veya O yaz
    cell.disabled = board[i] || isGameOver; //Dolu veya oyun bitmişse tıklanamasın
  });
  turnLabel.textContent = currentPlayer; //Sırası Geleni Göster
}

//Oyunu Yeniden bşalat
restartBtn.addEventListener("click", init);

//ilk başlama
init();
