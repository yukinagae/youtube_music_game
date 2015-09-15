"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = (function () {
  function Game(yt) {
    var _this = this;

    _classCallCheck(this, Game);

    // initialize
    this.YOUTUBE_ID = 'HNYkOJ-T63k';
    this._game = null;
    this._yt = yt;
    this._judge = null;
    this._timing = [6.14, 7.486, 8.155, 9.977, 10.377, 11.611, 12.062, 13.583, 14.223, 15.059, 16.241, 17.425, 20.186, 21.593, 22.313, 23.123, 24.297, 25.113, 26.148, 27.294, 28.103, 30.910, 31.601, 32.305, 33.024, 34.054, 35.360, 36.140, 37.028, 38.402, 39.129, 40.354, 41.051, 42.233, 43.043, 44.261, 45.705, 46.448, 47.416, 48.407, 50.158, 51.310, 52.363, 53.031, 54.417, 55.288, 56.472, 57.190, 58.110, 59.095, 60.776, 61.993, 62.370, 63.072, 64.493, 65.111, 66.414, 67.192, 68.891, 69.209, 70.056, 71.111, 72.861, 73.263, 74.639, 75.090, 75.941, 76.472, 76.992];
    this._timingIndex = 0;
    this._status = "stop";
    this._endTime = 80;
    // enchant
    enchant();
    // game setting
    this._game = new Core(800, 600);
    this._game.fps = 30;
    this._game.preload("icon.png", "shadow.png");
    this._game.start();
    this._game.onload = function () {
      _this._game.rootScene.addEventListener("touchstart", function (e) {
        if (_this._yt.isReady()) {
          _this._game.rootScene.addEventListener("enterframe", function () {
            _this._proccesRootSceneFrame();
          });
          _this._status = "playing";
          _this._yt.play();
        }
      });
      var video = new Entity();
      video._element = document.createElement('div');
      video.x = 500;
      video.y = 300;
      video._element.innerHTML = '<iframe src="https://www.youtube.com/embed/' + _this.YOUTUBE_ID + '?enablejsapi=1&controls=0&showinfo=0&autoplay=0&rel=0&vq=small"  width="300" height="200" frameborder="0" id="player"></iframe>';
      _this._game.rootScene.addChild(video);
      _this._judge = new Label();
      _this._judge.font = "36px Arial";
      _this._judge.x = 100;
      _this._judge.y = 100;
      _this._game.rootScene.addChild(_this._judge);
      var shadow = new Sprite(80, 80);
      shadow.image = _this._game.assets["shadow.png"];
      shadow.x = 100;
      shadow.y = 380;
      _this._game.rootScene.addChild(shadow);
    };
  }

  _createClass(Game, [{
    key: "_isNoteGenerateTiming",
    value: function _isNoteGenerateTiming() {
      if (this._timing[this._timingIndex]) {
        if (this._yt.getCurrentTime() > this._timing[this._timingIndex] - 1) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "_generateNote",
    value: function _generateNote(number) {
      var _this2 = this;

      var note = new Sprite(80, 80);
      note.image = this._game.assets["icon.png"];
      note.number = number;
      note.x = 100;
      note.y = -100;
      note.timing = this._timing[number];
      this._game.rootScene.addChild(note);
      note.tl.setTimeBased();
      note.tl.moveY(380, (this._timing[number] - this._yt.getCurrentTime()) * 1000);
      note.addEventListener("touchstart", function (e) {
        note.clearTime = _this2._yt.getCurrentTime();
        note.clear = true;
      });
      note.addEventListener("enterframe", function () {
        if (_this2._yt.getCurrentTime() > _this2._timing[number] + 1) {
          // console.log(note);
          _this2._game.rootScene.removeChild(note);
        }
        if (note.clear) {
          note.opacity -= 0.2;
          note.scale(note.scaleX + 0.05, note.scaleY + 0.05);
          if (note.opacity <= 0) {
            _this2._game.rootScene.removeChild(note);
            if (-0.2 <= note.clearTime - _this2._timing[number] && note.clearTime - _this2._timing[number] <= 0.2) {
              _this2._judge.text = "COOL";
            } else if (-0.4 <= note.clearTime - _this2._timing[number] && note.clearTime - _this2._timing[number] <= 0.4) {
              _this2._judge.text = "GOOD";
            } else {
              _this2._judge.text = "BAD";
            }
          }
        }
      });
    }
  }, {
    key: "_proccesRootSceneFrame",
    value: function _proccesRootSceneFrame() {
      if (this._status === "playing") {
        if (this._isNoteGenerateTiming()) {
          this._generateNote(this._timingIndex);
          this._timingIndex++;
        }
        if (this._yt.getCurrentTime() >= this._endTime) {
          this._yt.setVolume(this._yt.getVolume() - 1);
          if (this._yt.getVolume() <= 0) {
            this._yt.stop();
            this._status = "end";
          }
        }
      }
    }
  }]);

  return Game;
})();

var Yt = (function () {
  function Yt() {
    _classCallCheck(this, Yt);

    // initialize
    this._player = null;
    this._isReady = false;
    this._state = null;
    // youtube
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  // start

  _createClass(Yt, [{
    key: "play",
    value: function play() {
      this._player.playVideo();
    }
  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      return this._player.getCurrentTime();
    }
  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      this._player.setVolume(volume);
    }
  }, {
    key: "getVolume",
    value: function getVolume() {
      return this._player.getVolume();
    }
  }, {
    key: "isReady",
    value: function isReady() {
      return this._isReady;
    }
  }, {
    key: "onPlayerReady",
    value: function onPlayerReady() {
      this._isReady = true;
    }
  }]);

  return Yt;
})();

var yt = new Yt();
window.onYouTubeIframeAPIReady = function () {
  yt._player = new YT.Player('player', {
    events: {
      'onReady': function onReady() {
        yt.onPlayerReady();
      }
    }
  });
};
new Game(yt);

