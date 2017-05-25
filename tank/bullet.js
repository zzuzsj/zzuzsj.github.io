(function () {
    function Bullet(stage, layer) {
        this._bulletW = 2;
        this._bulletH = 4;
        this._buletIndex = 0;
        this._curBulletObj = {};
        this._bstage = stage;
        this._blayer = layer;
        this._destroyed = false;
    }
    Bullet.prototype = {
        selectType: function (type) {
            switch (type) {
                case 0:
                    this._moveV = 8;
                    this._carryer = 'foetankb';
                    this._effectTarget = 'myTank';
                    break;
                case 1:
                    this._moveV = 8;
                    this._carryer = 'foetankb';
                    this._effectTarget = 'myTank';
                    break;
                case 2:
                    this._moveV = 9;
                    this._carryer = 'foetankb';
                    this._effectTarget = 'myTank';
                    break;
                case 3:
                    this._moveV = 8;
                    this._carryer = 'mytankb';
                    this._effectTarget = 'foeTank';
                    break;
                default:
                    break;
            }
        },
        createBullet: function (dir, pos) {
            this._dir = dir;
            var that = this;
            that._buletIndex++;
            that._curBulletObj[that._buletIndex] = that._curBullet;
            that._curBullet = new Konva.Rect({
                width: that._bulletW,
                height: that._bulletH,
                offset: {
                    x: that._bulletW / 2,
                    y: that._bulletH / 2
                },
                x: pos.x,
                y: pos.y,
                name: that._carryer,
                effectTarget: that._effectTarget,
                bulletIndex: that._buletIndex,
                fill: 'white',
                rotation: dir * 90
            });
            that._blayer.add(that._curBullet);
            that._blayer.batchDraw();
        },
        bulletMove: function () {
            var x = this._curBullet.x();
            var y = this._curBullet.y();
            switch (this._dir) {
                case 0:
                    this._curBullet.y(y - this._moveV);
                    break;
                case 1:
                    this._curBullet.x(x + this._moveV);
                    break;
                case 2:
                    this._curBullet.y(y + this._moveV);
                    break;
                case 3:
                    this._curBullet.x(x - this._moveV);
                    break;
                default:
                    break;
            }
            this.hitJudge();
        },
        hitJudge: function () {
            var cx = this._curBullet.x();
            var cy = this._curBullet.y();
            var target = this._bstage.getIntersection({
                x: cx,
                y: cy
            }, '.'+this._curBullet.getAttr('effectTarget'));
            if (target) {
                target.setAttr('destroyed',true);
                target.destroy();
                this._curBullet.destroy();
                this._destroyed = true;
                return;
            }
            switch (this._dir) {
                case 0:
                    var ct = cy - this._bulletH / 2;
                    if (ct < 0) {
                        this._curBullet.destroy();
                        this._destroyed = true;
                    } else {
                        return;
                    }
                    break;
                case 1:
                    var cr = cx + this._bulletH / 2;
                    if (cr > this._sw) {
                        this._curBullet.destroy();
                        this._destroyed = true;
                    } else {
                        return;
                    }
                case 2:
                    var cb = cy + this._bulletH / 2;
                    if (cb > this._sh) {
                        this._curBullet.destroy();
                        this._destroyed = true;
                    } else {
                        return;
                    }
                case 3:
                    var cl = cx - this._bulletH / 2;
                    if (cl < 0) {
                        this._curBullet.destroy();
                        this._destroyed = true;
                    } else {
                        return;
                    }
                default:
                    break;
            }
        }
    }

    window.Bullet = Bullet;
})();