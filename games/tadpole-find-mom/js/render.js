var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;

// bgImage
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
  render();
}
bgImage.src = './images/bg.jpg';

// enemyImage
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
  enemyReady = true;
  render();
}
enemyImage.src = './images/enemy.png';

// heroImage
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
  render();
}
heroImage.src = './images/kedou.png';

// endImage
var endReady = false;
var endImage = new Image();
endImage.onload = function () {
  endReady = true;
  render();
}
endImage.src = './images/mama.png';

function render() {
  ctx.clearRect(0, 0, W, H);

  // 加载中
  if (!bgReady || !enemyReady || !heroReady || !endReady) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.fillText('加载中...', 330, 200);
    return;
  }

  if (!board.length) return;

  // 画bg
  ctx.drawImage(bgImage, 0, 0, W, H);

  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      switch (board[y][x]) {
        case 1:
          ctx.drawImage(enemyImage, BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);  // 画敌人
          break;
        case 2:
          ctx.drawImage(heroImage, BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);  // 画蝌蚪
          break;
        case 3:
          ctx.drawImage(endImage, BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);  // 画蝌蚪妈妈
          break;
      }
    }
  }

  if (failMaskVisible) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.fillText('撞到怪物,你死了~', 250, 200);
    timeEnd();
  }

  if (successMaskVisible) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.fillText('通关~', 350, 200);
    ctx.fillText('用时:' + (time / 1000).toFixed(3) + '秒', 285, 260);
    timeEnd();
  }

  if (newRankingVisible) {
    document.getElementById('submitBox').classList.remove('hide');
  }
}