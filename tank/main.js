(function () {
    function Main() {
        this._stageW = 800;
        this._stageH = 550;
        this._foeCreatePos = [{ x: 100, y: 80 }, { x: this._stageW / 2, y: 80 }, { x: this._stageW - 100, y: 80 }];
        this._myCreatePos = { x: this._stageW / 2, y: this._stageH - 80 };
        this._foeCreateTime = 150;
        this._foeNumTotal = 10;
    };

    Main.prototype = {
        bindStage: function () {
            var that = this;
            that._stage = new Konva.Stage({
                width: that._stageW,
                height: that._stageH,
                container: 'contentDiv',
                listening: true
            });
            that._layer = new Konva.Layer();
            var fastLayer=new Konva.FastLayer();
            var back=new Konva.Image({
                width:that._stageW,
                height:that._stageH,
                x:0,
                y:0,
            });
            fastLayer.add(back);
            that._back.onload=function(){
                back.image(that._back);
                fastLayer.draw();
            };
            that._stage.add(fastLayer);
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
            this._foeNum = this._foeNumTotal;
            this._createdFoe = 0;
            this._myNum = 1;
            this._foePosIndex = 1;
            this._useTime = 0;
            this._foeArr = [];
            this._myArr = [];
        },
        uninit: function () {
            this._foeNum = this._foeNumTotal;
            this._createdFoe = 0;
            this._myNum = 1;
            this._foePosIndex = 1;
            this._useTime = 0;
            this._foeArr = [];
            this._myArr = [];
        },
        addStart: function () {
            var that = this;
            that._startText = new Konva.Text({
                text: 'Game Start',
                fill: 'rgb(84,38,26)',
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
                text: 'Your Score:' + (that._foeNumTotal - that._foeNum),
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
                fill: 'rgb(84,38,26)',
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
        addSuccess: function () {
            var that = this;
            that._total = new Konva.Text({
                text: 'You Success!',
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
            if (that._startText) {
                that._startText.destroy();
                that._startText = null;
            } else {
                that._total.destroy();
                that._overText.destroy();
                that._overText = null;
                that._total = null;
            };

            that.createMyTank(that._myCreatePos);

            var step = function () {
                if (that._createdFoe < that._foeNumTotal) {
                    if (that._useTime == 0) {
                        that.createFoeTank(that._foeCreatePos[that._foePosIndex]);
                        that._createdFoe++;
                        that._foePosIndex++;
                        if (that._foePosIndex >= that._foeCreatePos.length) {
                            that._foePosIndex = 0;
                        }
                    }
                    that._useTime++;
                }
                if (that._useTime == that._foeCreateTime) {
                    that._useTime = 0;
                }
                if (that._foeNum == 0) {
                    that.gameSuccess();
                    return;
                }
                if (that._myNum == 0) {
                    that.gameOver();
                    return;
                }
                if (that._foeArr && that._foeArr.length > 0) {
                    for (var i = 0; i < that._foeArr.length; i++) {
                        (function (i) {
                            var foeTank = that._foeArr[i];
                            if (foeTank._destroyed) {
                                foeTank = null;
                                that._foeArr.splice(i, 1);
                                that._foeNum--;
                                return;
                            }
                            foeTank.tankMove();
                        })(i);
                    }
                }
                if (that._myArr && that._myArr.length > 0) {
                    for (var i = 0; i < that._myArr.length; i++) {
                        (function (i) {
                            var myTank = that._myArr[i];
                            if (myTank._destroyed) {
                                myTank = null;
                                that._myArr.splice(i, 1);
                                that._myNum--;
                                return;
                            }
                            myTank.tankMove();
                        })(i);
                    }
                }
                that._layer.batchDraw();
                that._requestId = requestAnimationFrame(step);
                // that.hitJudge();
            };
            step();
            var ableMove = function (dir) {
                that._myArr[0]._moveAble = true;
                that._myArr[0].directChange(dir);
                that._continuing = true;
            }
            $(document).on('keydown', function (e) {
                e.preventDefault();
                switch (e.keyCode) {
                    case 37:
                        ableMove(3);
                        break;
                    case 38:
                        ableMove(0);
                        break;
                    case 39:
                        ableMove(1);
                        break;
                    case 40:
                        ableMove(2);
                        break;
                    case 32:
                        that._myArr[0].fireBullet();
                        break;
                    default:
                        that._continuing = false;
                        break;
                }
            });
            $(document).on('keyup', function (e) {
                // that._disableMoveTime = setTimeout(function () {
                that._myArr[0]._moveAble = false;
                // }, 100);
            });
        },
        gameOver: function () {
            var that = this;
            window.cancelAnimationFrame(that._requestId);
            // that._stage.listening(true);
            that.addOver();
            that.uninit();
        },
        gameSuccess: function () {
            var that = this;
            window.cancelAnimationFrame(that._requestId);
            // that._stage.listening(true);
            that.addSuccess();
            that.uninit();
        },
        createFoeTank: function (pos) {
            var foeTank = new window.FoeTank(this._stage, this._layer);
            foeTank.selectType();
            switch (foeTank._tankType) {
                case 0:
                    foeTank.createTank(pos, this._tankType0);
                    break;
                case 1:
                    foeTank.createTank(pos, this._tankType1);
                    break;
                case 2:
                    foeTank.createTank(pos, this._tankType2);
                    break;
                default:
                    break;
            }
            this._foeArr.push(foeTank);
        },
        createMyTank: function (pos) {
            var myTank = new window.MyTank(this._stage, this._layer);
            myTank.createTank(pos, this._tankType3);
            this._myArr.push(myTank);
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
        }
    };

    window.Main = Main;

})();