var W = 800,
  H = 600,
  COLS = 20,
  ROWS = 15,
  board = [],  // 0: 空, 1: 敌人, 2: 英雄, 3: 终点
  hero = { x: 0, y: ROWS - 1 },
  failMaskVisible = false,
  successMaskVisible = false,
  newRankingVisible = false,
  time = 0;


// Create the canvas
var c = document.createElement('canvas');
var ctx = c.getContext('2d');
c.width = W;
c.height = H;
c.style.border = '1px solid #000';
document.getElementById('box').appendChild(c);


function init() {
  failMaskVisible = false;
  successMaskVisible = false;

  for (var y = 0; y < ROWS; y++) {
    board[y] = [];
    for (var x = 0; x < COLS; x++) {
      board[y][x] = 0;
    }
  }

  // 添加障碍
  for (var i = 0; i < 50; i++) {
    board[Math.floor(Math.random() * ROWS)][Math.floor(Math.random() * COLS)] = 1;
  }

  // 添加英雄
  board[ROWS - 1][0] = 2;
  hero.y = ROWS - 1;
  hero.x = 0;

  // 添加终点
  board[0][COLS - 1] = 3;
}


function keyPress(key) {
  if (failMaskVisible || successMaskVisible) return;
  try {
    var next;
    switch (key) {
      case 'left':
        next = board[hero.y][hero.x - 1];
        if (next === 0) {
          board[hero.y][hero.x] = 0;
          board[hero.y][hero.x - 1] = 2;
          hero.x--;
        }
        break;
      case 'right':
        next = board[hero.y][hero.x + 1];
        if (next === 0) {
          board[hero.y][hero.x] = 0;
          board[hero.y][hero.x + 1] = 2;
          hero.x++;
        }
        break;
      case 'up':
        next = board[hero.y - 1][hero.x];
        if (next === 0) {
          board[hero.y][hero.x] = 0;
          board[hero.y - 1][hero.x] = 2;
          hero.y--;
        }
        break;
      case 'down':
        var next = board[hero.y + 1][hero.x];
        if (next === 0) {
          board[hero.y][hero.x] = 0;
          board[hero.y + 1][hero.x] = 2;
          hero.y++;
        }
        break;
    }
    finish(next);
    render();
  } catch (err) {

  }
}
function finish(next) {
  if (next === 1) {
    failMaskVisible = true;
  } else if (next === 3) {
    successMaskVisible = true;
    if (rankingList && (rankingList.length < 10 || rankingList.find(d => d.use_time > time))) {
      newRankingVisible = true;
    }
  }
}


var timer = null;
function timeStart() {
  timeEnd();
  time = 0;
  var timeBox = document.getElementById('timeBox');
  timer = setInterval(function () {
    time += 17;
    timeBox.innerText = time;
  }, 17)
}
function timeEnd() {
  clearInterval(timer);
}



function newGame() {
  if (newRankingVisible) {
    newRankingVisible = false;
    document.getElementById('submitBox').classList.add('hide');
  }
  init();
  render();
  timeStart();
}

window.onload = function () {
  newGame();
}
