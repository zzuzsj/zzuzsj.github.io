(function () {
    function FoeTank(stage, layer) {
        this._tstage = stage;
        this._tlayer = layer;
        this._sw = stage.getWidth();
        this._sh = stage.getHeight();
        this._redectTime = 0;
        this._refireTime = 50;
        this._bulletArr = [];
        this._destroyed = false;
    };
    FoeTank.prototype = {
        selectType: function () {
            this._tankType = Math.floor(Math.random() * 3);
            switch (this._tankType) {
                case 0:
                    this._tankW = 60;
                    this._tankH = 90;
                    this._moveV = 4;
                    this._curDirect = 2;
                    this._backColor = 'green';
                    this._directTime = 50;
                    this._fireTime = 70;
                    break;
                case 1:
                    this._tankW = 55;
                    this._tankH = 100;
                    this._moveV = 7;
                    this._curDirect = 2;
                    this._backColor = 'red';
                    this._directTime = 40;
                    this._fireTime = 80;
                    break;
                case 2:
                    this._tankW = 70;
                    this._tankH = 100;
                    this._moveV = 3;
                    this._curDirect = 2;
                    this._backColor = 'blue';
                    this._directTime = 60;
                    this._fireTime = 70;
                    break;
            }
        },
        createTank: function (pos,image) {
            var that = this;
            that._tank = new Konva.Image({
                width: that._tankW,
                height: that._tankH,
                offset: {
                    x: that._tankW / 2,
                    y: that._tankH / 2,
                },
                x: pos.x,
                y: pos.y,
                rotation: 180,
                name: 'foeTank',
                destroyed: false,
                image:image
            });
            // var back = new Konva.Rect({
            //     width: that._tankW,
            //     height: that._tankH,
            //     x: 0,
            //     y: 0,
            //     fill: that._backColor
            // });
            // var wedge = new Konva.Wedge({
            //     x: that._tankW / 2,
            //     y: that._tankH / 2,
            //     radius: 30,
            //     angle: -300,
            //     fill: 'yellow',
            //     stroke: 'black',
            //     strokeWidth: 2,
            //     rotation: 60
            // });
            // that._tank.add(back);
            // that._tank.add(wedge);
            that._tlayer.add(that._tank);
            that._tlayer.batchDraw();
        },
        tankMove: function () {
            if (this._tank.getAttr('destroyed')) {
                this._destroyed = true;
                if (this._bulletArr && this._bulletArr.length > 0) {
                    var that = this;
                    for (var i = 0; i < that._bulletArr.length; i++) {
                        (function (i) {
                            that._bulletArr[i]._curBullet.destroy();
                        })(i);
                    }
                    that._bulletArr = [];
                }
                return;
            }
            if (this._redectTime <= 0) {
                this.directChange();
                this.timeToRedirect();
            } else {
                this._redectTime--;
            }
            if (this._refireTime <= 0) {
                this.fierBullet();
                this.timeToRefire();
            } else {
                this._refireTime--;
            }
            if (this._bulletArr && this._bulletArr.length > 0) {
                var that = this;
                for (var i = 0; i < this._bulletArr.length; i++) {
                    (function (i) {
                        var bullet = that._bulletArr[i];
                        if (bullet._destroyed) {
                            that._bulletArr.splice(i, 1);
                            return;
                        }
                        bullet.bulletMove();
                    })(i);
                }
            }
            switch (this._curDirect) {
                case 0:
                    this._tank.y(this._tank.y() - this._moveV);
                    break;
                case 1:
                    this._tank.x(this._tank.x() + this._moveV);
                    break;
                case 2:
                    this._tank.y(this._tank.y() + this._moveV);
                    break;
                case 3:
                    this._tank.x(this._tank.x() - this._moveV);
                    break;
                default:
                    break;
            }
            this.boundJudge();
            // this._tlayer.batchDraw();
        },
        boundJudge: function () {
            var cx = this._tank.x();
            var cy = this._tank.y();

            switch (this._curDirect) {
                case 0:
                    var ct = cy - this._tankH / 2;
                    if (ct < 0) {
                        this._tank.y(this._tankW / 2);
                        this.directChange();
                        this.timeToRedirect();
                    } else {
                        return;
                    }
                    break;
                case 1:
                    var cr = cx + this._tankH / 2;
                    if (cr > this._sw) {
                        console.log(cr);
                        this._tank.x(this._sw - this._tankW / 2);
                        this.directChange();
                        this.timeToRedirect();
                    } else {
                        return;
                    }
                case 2:
                    var cb = cy + this._tankH / 2;
                    if (cb > this._sh) {
                        this._tank.y(this._sh - this._tankW / 2);
                        this.directChange();
                        this.timeToRedirect();
                    } else {
                        return;
                    }
                case 3:
                    var cl = cx - this._tankH / 2;
                    if (cl < 0) {
                        this._tank.x(this._tankW / 2);
                        this.directChange();
                        this.timeToRedirect();
                    } else {
                        return;
                    }
                default:
                    break;
            }
        },
        directChange: function () {
            var curDirect;
            do {
                curDirect = Math.floor(Math.random() * 4);
            } while (curDirect == this._curDirect);
            var rotation = curDirect * 90;
            this._curDirect = curDirect;
            this._tank.rotation(rotation);
        },
        fierBullet: function () {
            var bullet = new window.Bullet(this._tstage, this._tlayer);
            var pos = {};
            switch (this._curDirect) {
                case 0:
                    pos.x = this._tank.x();
                    pos.y = this._tank.y() - this._tankH / 2;
                    break;
                case 1:
                    pos.x = this._tank.x() + this._tankH / 2;
                    pos.y = this._tank.y();
                    break;
                case 2:
                    pos.x = this._tank.x();
                    pos.y = this._tank.y() + this._tankH / 2;
                    break;
                case 3:
                    pos.x = this._tank.x() - this._tankH / 2;
                    pos.y = this._tank.y();
                    break;
                default:
                    break;
            }
            bullet.selectType(this._tankType);
            bullet.createBullet(this._curDirect, pos);
            this._bulletArr.push(bullet);
        },
        timeToRedirect: function () {
            this._redectTime = Math.floor(Math.random() * this._directTime) + 20;
        },
        timeToRefire: function () {
            this._refireTime = Math.floor(Math.random() * this._fireTime) + 50;
        }
    };

    // ======================== tank range =========================//

    function MyTank(stage, layer) {
        this._tstage = stage;
        this._tlayer = layer;
        this._sw = stage.getWidth();
        this._sh = stage.getHeight();
        this._tankW = 60;
        this._tankH = 80;
        this._moveV = 5;
        this._curDirect = 0;
        this._backColor = 'aqua';
        this._moveAble = false;
        this._bulletArr = [];
        this._tankType = 3;
        this._destroyed = false;
    };
    MyTank.prototype = {
        createTank: function (pos,image) {
            var that = this;
            that._tank = new Konva.Image({
                width: that._tankW,
                height: that._tankH,
                offset: {
                    x: that._tankW / 2,
                    y: that._tankH / 2,
                },
                x: pos.x,
                y: pos.y,
                rotation: 0,
                name: 'myTank',
                destroyed: false,
                image:image
            });
            // var back = new Konva.Rect({
            //     width: that._tankW,
            //     height: that._tankH,
            //     x: 0,
            //     y: 0,
            //     fill: that._backColor
            // });
            // var wedge = new Konva.Wedge({
            //     x: that._tankW / 2,
            //     y: that._tankH / 2,
            //     radius: 30,
            //     angle: -300,
            //     fill: 'yellow',
            //     stroke: 'black',
            //     strokeWidth: 2,
            //     rotation: 60
            // });
            // that._tank.add(back);
            // that._tank.add(wedge);
            that._tlayer.add(that._tank);
            that._tlayer.batchDraw();
        },
        tankMove: function () {
            if (this._tank.getAttr('destroyed')) {
                this._destroyed = true;
                return;
            }
            if (this._redectTime <= 0) {
                this.directChange();
                this.timeToRedirect();
            } else {
                this._redectTime--;
            }
            if (this._bulletArr && this._bulletArr.length > 0) {
                var that = this;
                for (var i = 0; i < this._bulletArr.length; i++) {
                    (function (i) {
                        var bullet = that._bulletArr[i];
                        if (bullet._destroyed) {
                            that._bulletArr.splice(i, 1);
                            return;
                        }
                        bullet.bulletMove();
                    })(i);
                }
            }
            if (this._moveAble) {

                switch (this._curDirect) {
                    case 0:
                        this._tank.y(this._tank.y() - this._moveV);
                        break;
                    case 1:
                        this._tank.x(this._tank.x() + this._moveV);
                        break;
                    case 2:
                        this._tank.y(this._tank.y() + this._moveV);
                        break;
                    case 3:
                        this._tank.x(this._tank.x() - this._moveV);
                        break;
                    default:
                        break;
                }
                this.boundJudge();
            }
        },
        boundJudge: function () {
            var cx = this._tank.x();
            var cy = this._tank.y();

            switch (this._curDirect) {
                case 0:
                    var ct = cy - this._tankH / 2;
                    if (ct < 0) {
                        this._tank.y(this._tankW / 2);
                    } else {
                        return;
                    }
                    break;
                case 1:
                    var cr = cx + this._tankH / 2;
                    if (cr > this._sw) {
                        this._tank.x(this._sw - this._tankW / 2);
                    } else {
                        return;
                    }
                case 2:
                    var cb = cy + this._tankH / 2;
                    if (cb > this._sh) {
                        this._tank.y(this._sh - this._tankW / 2);
                    } else {
                        return;
                    }
                case 3:
                    var cl = cx - this._tankH / 2;
                    if (cl < 0) {
                        this._tank.x(this._tankW / 2);
                    } else {
                        return;
                    }
                default:
                    break;
            }
        },
        directChange: function (direct) {
            this._curDirect = direct;
            var rotation = this._curDirect * 90;
            this._tank.rotation(rotation);
        },
        fireBullet: function () {
            var bullet = new window.Bullet(this._tstage, this._tlayer);
            var pos = {};
            switch (this._curDirect) {
                case 0:
                    pos.x = this._tank.x();
                    pos.y = this._tank.y() - this._tankH / 2;
                    break;
                case 1:
                    pos.x = this._tank.x() + this._tankH / 2;
                    pos.y = this._tank.y();
                    break;
                case 2:
                    pos.x = this._tank.x();
                    pos.y = this._tank.y() + this._tankH / 2;
                    break;
                case 3:
                    pos.x = this._tank.x() - this._tankH / 2;
                    pos.y = this._tank.y();
                    break;
                default:
                    break;
            }
            bullet.selectType(this._tankType);
            bullet.createBullet(this._curDirect, pos);
            this._bulletArr.push(bullet);
        }
    };



    window.FoeTank = FoeTank;
    window.MyTank = MyTank;

})();