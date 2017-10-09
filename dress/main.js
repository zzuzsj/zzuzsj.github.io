(function () {
    function Main(width, height, materialObj, debug) {
        this.stageW = Math.floor(width);
        this.stageH = Math.floor(height);
        this.materialObj = materialObj;
        this.debug = debug;
        this._index = 0;
    };

    Main.prototype = {
        bindStage: function () {
            var that = this;
            that._stage = new Konva.Stage({
                width: that.stageW,
                height: that.stageH,
                container: 'contentDiv',
                listening: true,
                // scaleX:0.5,
                // scaleY:0.5
            });
            that._layer = new Konva.Layer();
            that._stage.add(that._layer);
            // that.addStart();
        },
        init: function () {
            var that = this;
            that._figure = null;
            that._haircut = null;
            that._headwave = null;
            that._face = null;
            that._cloth = null;
            that._pants = null;
            that._sock = null;
            that._shoes = null;
            that.createFigure();
        },
        uninit: function () {
            var that = this;
            that._figure = null;
            that._haircut = null;
            that._headwave = null;
            that._face = null;
            that._cloth = null;
            that._pants = null;
            that._sock = null;
            that._shoes = null;
            that._stage = null;
            that._layer = null;
        },
        getThumb: function () {
            if (null != this._stage) {
                if (this._stage.scaleX() != 1) {
                    this._stage.scale({ x: 1, y: 1 });
                }
                this._stage.draw();
                return this._stage.toDataURL({
                    mimeType: 'image/jpeg',
                    quality: 1
                });
            }
            else {
                return null;
            }
        },
        downloadThumb: function () {
            var dataUrl = this.getThumb();
            $('#download').attr('href', dataUrl);
            $('#download').attr('download', 'thumb.png')
            window.open = dataUrl;
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
            that._startText.x(that.stageW / 2 - tw / 2);
            that._startText.y(that.stageH / 2 - th / 2);
            that._layer.add(that._startText);
            that._layer.batchDraw();
        },
        addOver: function () {
            var that = this;
            that._total = new Konva.Text({
                text: 'Game Over',
                fill: 'rgb(64,120,255)',
                fontStyle: 'bold',
                fontSize: 30,
                fontFamily: 'Times New Roman'
            });
            var tow = that._total.width();
            var toh = that._total.height();
            that._total.x(that.stageW / 2 - tow / 2);
            that._total.y(that.stageH / 2 - toh / 2 - 20);
            that._overText = new Konva.Text({
                text: 'Restart',
                fill: 'rgb(84,38,26)',
                fontStyle: 'bold',
                fontSize: 30,
                fontFamily: 'Times New Roman'
            });
            var tw = that._overText.width();
            var th = that._overText.height();
            that._overText.x(that.stageW / 2 - tw / 2);
            that._overText.y(that.stageH / 2 + th / 2 - 20);
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
            that._total.x(that.stageW / 2 - tow / 2);
            that._total.y(that.stageH / 2 - toh / 2 - 20);
            that._overText = new Konva.Text({
                text: 'Restart',
                fill: 'rgb(168,120,79)',
                fontStyle: 'bold',
                fontSize: 30,
                fontFamily: 'Times New Roman'
            });
            var tw = that._overText.width();
            var th = that._overText.height();
            that._overText.x(that.stageW / 2 - tw / 2);
            that._overText.y(that.stageH / 2 + th / 2 - 20);
            that._layer.add(that._total);
            that._layer.add(that._overText);
            that._layer.batchDraw();
        },
        createFigure: function () {
            var that = this;
            var figureX = Math.floor((that.stageW-110)/2);
            var figureY = Math.floor((that.stageH-500)/2);
            that._figure = new Konva.Group({
                width: 110,
                height: 500,
                x: figureX,
                y: figureY,
                name: 'figure',
                // draggable: true
            })
            that._model = new Konva.Image({
                name: 'model',
            });
            that._haircut = new Konva.Image({
                name: 'haircut',
                // draggable: true
            });
            that._face = new Konva.Image({
                name: 'face',
                // draggable: true
            });
            that._cloth = new Konva.Image({
                name: 'cloth',
                // draggable: true
            });
            that._pants = new Konva.Image({
                name: 'pants',
                // draggable: true
            });
            that._sock = new Konva.Image({
                name: 'sock',
                // draggable: true
            });
            that._shoes = new Konva.Image({
                name: 'shoes',
                // draggable: true
            });
            that._back = new Konva.Image({
                name: 'back',
                // draggable: false
            });
            that._figure.add(that._model);
            that._figure.add(that._sock);
            that._figure.add(that._shoes);
            that._figure.add(that._pants);
            that._figure.add(that._cloth);
            that._figure.add(that._face);
            that._figure.add(that._haircut);
            that._layer.add(that._back);
            that._layer.add(that._figure);
            // that.addEvents();
            that.fillImage(that._back, 0);
            that.fillImage(that._model, 0);
            that.fillImage(that._sock, 1);
            that.fillImage(that._shoes, 1);
            that.fillImage(that._pants, 1);
            that.fillImage(that._cloth, 0);
            that.fillImage(that._haircut, 11);
            // that.fillImage(that._face, 1);
        },
        fillImage: function (knode, kindex) {
            var that = this;
            var type = knode.getAttr('name');
            if (!that.materialObj[type][kindex]) {
                return;
            }
            var data = that.materialObj[type][kindex];
            if (type == 'back') {
                knode.width(that.stageW + 6);
                knode.height(that.stageH + 6);
            } else {
                knode.width(data.w);
                knode.height(data.h);
            }
            knode.x(data.x);
            knode.y(data.y);
            if (data.image && data.image != null) {
                knode.image(data.image);
                that._layer.draw();
            } else {
                var dataimage = new Image();
                dataimage.src = data.src;
                dataimage.onload = function () {
                    that.materialObj[type][kindex].image = dataimage;
                    knode.image(dataimage);
                    that._layer.draw();
                }
            }
        },
        addEvents: function () {
            var that = this;
            that._stage.on('contentTouchstart', function (ev) {
                that.startEvent(ev);
            });
            that._stage.on('contentTouchend', function (ev) {
                that.endEvent(ev);
            })
        },
        startEvent: function (ev) {
            if (this.debug) {
                this._curImage = this._stage.getIntersection(this._stage.getPointerPosition(), 'Image');
                this._isDebug = true;

                if (this._curImage.getAttr('name') == 'shoes') {
                    this._isDebug = false;
                }
            }
        },
        endEvent: function (ev) {
            if (this.debug && this._curImage) {
                console.log(Math.floor(this._curImage.x()), Math.floor(this._curImage.y()));
                if (this._isDebug) {
                    // this.fillImage(this._back, this._index);
                    // this.fillImage(this._haircut, this._index);
                    // this.fillImage(this._cloth, this._index);
                    // this.fillImage(this._face, this._index);
                    // this.fillImage(this._pants, this._index);
                    // this.fillImage(this._sock, this._index);
                    // this.fillImage(this._shoes, this._index);
                }
            }
            this._isDebug = false;
        }
    };

    window.Main = Main;

})();