(function () {
    function Flappy() {
        this._stageW = 600;
        this._stageH = 400;

        this._moveV = 5;
        this._accelertV = -0.35;
        this._addYV = 6;
        this._startX = 100;
        this._startY = 150;
        this._birdScaleW = 50;
        this._birdScaleH = 50;
        this._pipeW = 60;
        this._pipeSpace = 300;
    };

    Flappy.prototype = {
        bindStage: function () {
            var that = this;
            that._stage = new Konva.Stage({
                width: that._stageW,
                height: that._stageH,
                container: 'contentDiv',
                listening: true
            });
            that._layer = new Konva.Layer();
            that._stage.add(that._layer);
            that.addStart();
            that._stage.on('click', function () {
                var text = that._layer.getIntersection(that._stage.getPointerPosition(), 'Text');
                if (!text) {
                    return;
                };
                if (text == that._startText) {
                    that.init();
                    that.gameStart();
                } else if (text == that._overText) {
                    that._stage.removeChildren();
                    that._layer = new Konva.Layer();
                    that._stage.add(that._layer);
                    that.init();
                    that.gameStart();
                };
            });
        },
        init: function () {
            this._startYV = 0;
            this._birdYV = 0;
            this._useTime = 0;
            this._pipeArr = [];
            this._requestId = null;
            this._passedNum = 0;
            this._totalText = null;
        },
        uninit: function () {
            this._startYV = 0;
            this._birdYV = 0;
            this._useTime = 0;
            this._requestId = null;
            this._passedNum = 0;
            this._totalText = null;
            this._pipeArr = [];
        },
        addStart: function () {
            var that = this;
            that._startText = new Konva.Text({
                text: 'Game Start',
                fill: 'rgb(168,120,79)',
                fontStyle: 'bold',
                fontSize: 30,
                fontFamily: 'Times New Roman'
            });
            var tw = that._startText.width();
            var th = that._startText.height();
            that._startText.x(that._stageW / 2 - tw / 2);
            that._startText.y(that._stageH / 2 - th / 2);
            that._layer.add(that._startText);
            that._layer.batchDraw();
        },
        addOver: function () {
            var that = this;
            that._total = new Konva.Text({
                text: 'Your Score:' + that._passedNum,
                fill: 'rgb(64,120,255)',
                fontStyle: 'bold',
                fontSize: 30,
                fontFamily: 'Times New Roman'
            });
            var tow = that._total.width();
            var toh = that._total.height();
            that._total.x(that._stageW / 2 - tow / 2);
            that._total.y(that._stageH / 2 - toh / 2 - 20);
            that._overText = new Konva.Text({
                text: 'Restart',
                fill: 'rgb(168,120,79)',
                fontStyle: 'bold',
                fontSize: 30,
                fontFamily: 'Times New Roman'
            });
            var tw = that._overText.width();
            var th = that._overText.height();
            that._overText.x(that._stageW / 2 - tw / 2);
            that._overText.y(that._stageH / 2 + th / 2 - 20);
            that._layer.add(that._total);
            that._layer.add(that._overText);
            that._layer.batchDraw();
        },
        gameStart: function () {
            var that = this;
            that._stage.listening(false);
            that.createBird();
            that.passNumChange();
            if (that._startText) {
                that._startText.destroy();
                that._startText = null;
            } else {
                that._total.destroy();
                that._overText.destroy();
                that._overText = null;
                that._total = null;
            };
            var step = function () {
                that._useTime++;
                if (that._useTime % 60 == 0) {
                    that.createPipe();
                };
                that.pipeMove();
                that.birdDrop();
                that._layer.batchDraw();
                that._requestId = requestAnimationFrame(step);
                that.hitJudge();
            };
            step();
            $('#contentDiv').on('click', function () {
                that.birdJump();
            });
        },
        gameOver: function () {
            var that = this;
            window.cancelAnimationFrame(that._requestId);
            that._stage.listening(true);
            that.addOver();
            that.uninit();
        },
        passNumChange: function () {
            var that = this;
            if (that._passedNum == 0) {
                that._totalText = new Konva.Text({
                    fontSize: 20,
                    fill: '#333',
                    x: 20,
                    y: 20,
                    text: "Total:" + that._passedNum
                });
                that._layer.add(that._totalText);
                that._layer.batchDraw();
            } else {
                that._totalText.text("Total:" + that._passedNum);
                that._layer.batchDraw();
            };
        },
        createBird: function () {
            var that = this;
            var logo=new Image();
            logo.src="LOGO.png";
            that._flappyBird = new Konva.Image({
                width: that._birdScaleW,
                height: that._birdScaleH,
                x: that._startX,
                y: that._startY,
                name: 'bird'
            });
            logo.onload=function(){
                that._flappyBird.image(logo);
                that._layer.batchDraw();
            };
            that._layer.add(that._flappyBird);
            that._layer.batchDraw();
        },
        birdDrop: function () {
            var that = this;
            that._flappyBird.y(that._flappyBird.y() - that._birdYV);
            that._birdYV += that._accelertV;
        },
        birdJump: function () {
            this._birdYV = this._addYV;
        },
        createPipe: function () {
            var total = this._stageH - 130;
            var upH = Math.floor(Math.random() * (this._stageH - 200)) + 20;
            var lowH = total - upH;
            var that = this;
            var pipe = new Konva.Group({
                x: that._stageW,
                y: 0,
                width: that._pipeW,
                height: that._stageH,
                name: 'pipeGroup',
                upY: upH,
                lowY: that._stageH - lowH
            });
            that._pipeArr.push(pipe);
            var pipeUp = new Konva.Rect({
                width: this._pipeW,
                height: upH,
                x: 0,
                y: 0,
                fill: 'green'
            });
            var pipeLow = new Konva.Rect({
                width: this._pipeW,
                height: lowH,
                x: 0,
                y: that._stageH - lowH,
                fill: 'green'
            });
            pipe.add(pipeUp);
            pipe.add(pipeLow);
            that._layer.add(pipe);
            that._layer.batchDraw();
        },
        pipeMove: function () {
            var that = this;
            if (that._pipeArr.length == 0) {
                return;
            };
            for (var i = 0; i < that._pipeArr.length; i++) {
                (function (i) {
                    var pipe = that._pipeArr[i];
                    pipe.x(pipe.x() - that._moveV);
                    if ((pipe.x() + that._pipeW) == that._startX) {
                        that._passedNum++;
                        that.passNumChange();
                    } else if (pipe.x() < -that._pipeW) {
                        pipe.destroy();
                        that._pipeArr.splice(0, 1);
                        return;
                    }
                })(i);
            }
        },
        hitJudge: function () {
            var that = this;
            if (that._pipeArr.length == 0) {
                return;
            };
            var curPipe = that._pipeArr[0];
            var curx = curPipe.x();
            if ((curx > (that._startX + that._birdScaleW)) || ((curx + that._pipeW) < that._startX)) {
                return;
            };
            var upY = curPipe.getAttr('upY');
            var lowY = curPipe.getAttr('lowY');
            var birdTY = that._flappyBird.y();
            var birdBY = that._flappyBird.y() + that._birdScaleH;
            if ((birdTY < upY) || birdBY > lowY) {
                if (that._requestId) {
                    that.gameOver();
                };
            };
        }
    };

    window.Flappy = Flappy;

})();