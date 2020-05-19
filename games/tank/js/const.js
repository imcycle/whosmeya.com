

var SCREEN_WIDTH = 512;  // 屏幕宽
var SCREEN_HEIGHT = 448;  // 屏幕高
var CMAP_WIDTH = 416;  // 地图宽
var CMAP_HEIGHT = 416;  // 地图高
var CMAP_X = 32;  // 地图偏移量
var CMAP_Y = 16;  // 地图偏移量

/**
 * 图片
 */
var MENU_IMAGE = new Image();
MENU_IMAGE.src = '../images/menu.gif';
var RESOURCE_IMAGE = new Image();
RESOURCE_IMAGE.src = './images/tankAll.gif';


/**
 * 各个图块在图片中的位置
 */
var POS = new Array();
POS["selectTank"] = [128, 96];
POS["stageLevel"] = [396, 96];
POS["num"] = [256, 96];
POS["map"] = [0, 96];
POS["home"] = [256, 0];
POS["score"] = [0, 112];
POS["player"] = [0, 0];
POS["protected"] = [160, 96];
POS["enemyBefore"] = [256, 32];
POS["enemy1"] = [0, 32];
POS["enemy2"] = [128, 32];
POS["enemy3"] = [0, 64];
POS["bullet"] = [80, 96];
POS["tankBomb"] = [0, 160];
POS["bulletBomb"] = [320, 0];
POS["over"] = [384, 64];
POS["prop"] = [256, 110];


/**
 * 游戏状态
 */
var GAME_STATE_MENU = 0;
var GAME_STATE_INIT = 1;
var GAME_STATE_START = 2;
var GAME_STATE_OVER = 3;
var GAME_STATE_WIN = 4;



/**
 * 地图快
 */
var WALL = 1;
var GRID = 2;
var GRASS = 3;
var WATER = 4;
var ICE = 5;
var HOME = 9;
var ANOTHREHOME = 8;
