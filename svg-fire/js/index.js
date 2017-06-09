'use strict'

TweenMax.lagSmoothing(0);
console.clear();
var Flame = (function () {
  function Flame(svg, start, end, width, particle) {
    this.id = String(Math.round(Math.random() * 999999999999999));
    this.group = svg.group();
    this.group.addClass('flame');
    this.startPoint = start;
    this.endPoint = end;
    this.startThickness = width + Math.round(Math.random() * 50);
    this.endThickness = 10 + Math.round(Math.random() * 10);
    this.guidePosition = Math.random() * 100;
    this.frequency = 0.01 + Math.random() * 0.008;
    this.amplitude = 40 + Math.random() * 40;
    this.height = 500;
    this.endHeight = 100 + Math.round(Math.random() * 400);
    this.y = Math.random() * 100;
    this.particle = particle;
    var colors = ['#F9ECA9', '#EFC900', '#D79700', '#D0BB48'];
    this.body = this.group.path().attr({
      fill: this.particle ? '#F9ECA9' : colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      stroke: 'none'
    });
    this.updateGuide();
  }
  Flame.prototype.remove = function () {
    this.group.remove();
  };
  Flame.prototype.updateGuide = function () {
    this.guide = [];
    var height = this.startPoint.y - this.endPoint.y;
    var widthChange = this.startPoint.x - this.endPoint.x;
    var y = this.startPoint.y;
    while (y-- >= this.endPoint.y) {
      var x = this.startPoint.x + (widthChange - (widthChange / height) * y);
      var wave = Math.sin(y * this.frequency + this.guidePosition);
      this.guide.push({ y: y, x: x + (wave * this.amplitude / 2 + this.amplitude / 2) });
    }
  };
  Flame.prototype.start = function (onComplete) {
    if (this.particle)
      TweenMax.to(this, (0.2 + Math.random()), { y: this.guide.length, height: this.endHeight, position: '+=6', ease: Linear.ease, onComplete: onComplete, onCompleteParams: [this] });
    else
      TweenMax.to(this, 0.5 + (Math.random()), { y: this.guide.length, height: this.endHeight, position: '+=6', ease: Power2.easeIn, onComplete: onComplete, onCompleteParams: [this] });
  };
  Flame.prototype.getPointAlongGuide = function (y, offsetXPercentage) {
    if (this.guide.length) {
      if (y >= this.guide.length)
        y = this.guide.length - 1;
      if (y < 0)
        y = 0;
      var thicknessDifference = this.endThickness - this.startThickness;
      var percentageAlongGuide = (y / this.guide.length) * 100;
      var thickness = this.startThickness + ((thicknessDifference / 100) * percentageAlongGuide);
      var xOffset = ((thickness / 2) / 100) * offsetXPercentage;
      return { x: this.guide[y].x + xOffset, y: this.guide[y].y };
    }
    return { x: 0, y: 0 };
  };
  Flame.prototype.drawPath = function (pathPoints) {
    var points = [];
    for (var i = 0; i < pathPoints.length; i++) {
      var subPoints = [];
      for (var j = 0; j < pathPoints[i].points.length / 2; j++) {
        var p = pathPoints[i].points.slice(j * 2, j * 2 + 2);
        var point = this.getPointAlongGuide(Math.round(p[1]), p[0]);
        subPoints.push(point.x);
        subPoints.push(point.y);
      }
      points.push(pathPoints[i].type + subPoints.join(' '));
    }
    return points.join(' ') + 'Z';
  };
  Flame.prototype.draw = function () {
    if (this.height > 0) {
      var y = Math.round(this.y);
      var height = Math.round(this.height);
      var heightChunks = height / 6;
      // I want to change this bit, this array could be generated in a loop.
      var body = this.particle ? [{ type: 'M', points: [0, y] },
        {
          type: 'L', points: [10, y - heightChunks * 0.2,
            20, y - heightChunks * 0.4,
            30, y - heightChunks * 0.6,]
        }] : [
              { type: 'M', points: [0, y] },
          {
            type: 'L', points: [10, y - heightChunks * 0.2,
              20, y - heightChunks * 0.4,
              30, y - heightChunks * 0.6,
              40, y - heightChunks * 0.8,
              50, y - heightChunks * 1,
              60, y - heightChunks * 1.2,
              70, y - heightChunks * 1.4,
              80, y - heightChunks * 1.6,
              90, y - heightChunks * 1.8,
              90, y - heightChunks * 2,
              90, y - heightChunks * 2.2,
              80, y - heightChunks * 2.4,
              70, y - heightChunks * 2.6,
              60, y - heightChunks * 2.8,
              50, y - heightChunks * 3,
              40, y - heightChunks * 3.1,
              30, y - heightChunks * 3.2,
              20, y - heightChunks * 3.3,
              10, y - heightChunks * 3.4,
              0, y - heightChunks * 3.5,
              -10, y - heightChunks * 3.4,
              -20, y - heightChunks * 3.3,
              -30, y - heightChunks * 3.2,
              -40, y - heightChunks * 3.1,
              -50, y - heightChunks * 3,
              -60, y - heightChunks * 2.8,
              -70, y - heightChunks * 2.6,
              -80, y - heightChunks * 2.4,
              -90, y - heightChunks * 2.2,
              -90, y - heightChunks * 2,
              -90, y - heightChunks * 1.8,
              -80, y - heightChunks * 1.6,
              -70, y - heightChunks * 1.4,
              -60, y - heightChunks * 1.2,
              -50, y - heightChunks * 1,
              -40, y - heightChunks * 0.8,
              -30, y - heightChunks * 0.6,
              -20, y - heightChunks * 0.4,
              -10, y - heightChunks * 0.2,
              0, y - heightChunks * 0,
            ]
          },
        ];
      this.body.attr({ d: this.drawPath(body) });
    }
  };
  return Flame;
}());
var StageManager = (function () {
  function StageManager(svg) {
    this.svg = svg;
    this.fire = {};
    this.size = { width: 0, height: 0 };
  }
  StageManager.prototype.init = function () {
    var _this = this;
    window.addEventListener('resize', function () { return _this.onResize(); }, true);
    this.onResize();
    this.tick();
  };
  StageManager.prototype.onResize = function () {
    this.size.width = 400;
    this.size.height = 800;
    this.svg
        .attr('width', this.size.width)
        .attr('height', this.size.height);
  };
  StageManager.prototype.addFlame = function () {
    var _this = this;
    var particle = Math.random() > .8;
    var start = { x: this.size.width / 2, y: this.size.height - (40) };
    var end = { x: (this.size.width / 4) + Math.random() * (this.size.width / 2), y: particle ? -20 : this.size.height / 3 };
    var width = this.size.width / 4;
    var flame = new Flame(this.svg, start, end, width, particle);
    flame.start(function (flame) { return _this.removeFlame(flame); });
    this.fire[flame.id] = flame;
  };
  StageManager.prototype.removeFlame = function (flame) {
    delete this.fire[flame.id];
    flame.remove();
    flame = null;
  };
  StageManager.prototype.tick = function () {
    var _this = this;
    for (var i in this.fire) {
      this.fire[i].draw();
    }
    requestAnimationFrame(function () { return _this.tick(); });
  };
  return StageManager;
}());
var stageManager = new StageManager(Snap('svg'));
stageManager.init();
makeFlame();
function makeFlame() {
  stageManager.addFlame();
  setTimeout(makeFlame, Math.random() * 60);
}