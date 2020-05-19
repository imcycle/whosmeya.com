/**
 * 
 */
var Cmap = function () {
  this.level = 1;
  this.cmapLevel = null;




}

Cmap.prototype = {
  setCmapLevel: function (level) {
    this.level = level;
    var m = evel('map' + this.level);
    this.cmapLevel = [];
    for (var i = 0; i < m.length; i++) {
      this.cmapLevel[i] = [];
      for (var j = 0; j < m[i].length; j++) {
        cmapLevel[i][j] = m[i][j];
      }
    }
  },
  draw: function () {

  }
}