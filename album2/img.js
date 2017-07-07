/**
 * Created by Administrator on 2016/10/21 0021.
 */
(function () {
    window.zsj = window.zsj || {};
    function Page(index, width, height) {
        this._imgArray = [];
        this._pageIndex = index;
        this._canvasWidth = width;
        this._canvasHeight = height;
        this._moveInTime = 200;
        this._moveOutTime = 30;
    }
    Page.prototype = {
        init: function () {
            this._moveTime = 0;
            this._status = 'ready';
            this._moveInInterval = null;
            this._moveOutInterval = null;
        },
        uninit: function () {
            this._moveTime = 0;
            this._status = 'ready';
            if (this._moveInInterval) {
                window.cancelAnimationFrame(this._moveInInterval);
                this._moveInInterval = null;
            }
            if (this._moveOutInterval) {
                window.cancelAnimationFrame(this._moveOutInterval);
                this._moveOutInterval = null;
            }
        },
        moveIn: function (ctx,complete) {
            this.paintImage(ctx,complete);
            this._status = 'moveIn';
        },
        moveOut: function (ctx,complete) {
            this.clearImage(ctx, 2, true,complete);
            this._status = 'ready';
        },
        paintImage: function (ctx,complete) {
            var that=this;
            that.clearImage(ctx, 1, false);
            for (var i = 0; i < that._imgArray.length; i++) {
                var img = that._imgArray[i];
                img.drawImg(ctx, that._moveTime);
            }
            that._moveTime++;
            that._moveInInterval = window.requestAnimationFrame(that.paintImage.bind(that,ctx,complete));
            if (that._moveTime > that._moveInTime) {
                window.cancelAnimationFrame(that._moveInInterval);
                that._moveInInterval = null;
                that._status = 'ready';
                that._moveTime = 0;
                if(complete){
                    complete();
                }
            }
        },
        clearImage: function (ctx, caseIndex, moveOut,complete) {
            switch (caseIndex) {
                case 1:
                    ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
                    break;
                case 2:
                    ctx.fillStyle = 'rgba(255,255,255,0.2)';
                    ctx.fillRect(0, 0, this._canvasWidth, this._canvasHeight);
                    break;
                default:
                    break;
            }
            if (moveOut) {
                this._moveTime++;
                console.log(this._pageIndex,this._moveTime);
                this._moveOutInterval = window.requestAnimationFrame(this.clearImage.bind(this,ctx,caseIndex,moveOut,complete));
                if (this._moveTime > this._moveOutTime) {
                    window.cancelAnimationFrame(this._moveOutInterval);
                    this._moveOutInterval = null;
                    this._status = 'ready';
                    this._moveTime = 0;
                    if(complete){
                        complete();
                    }
                }
            }

        }

    }

    zsj.Page = Page;

    // ===================================================================================================
    function CreateImg(Url, x, y, width, height, startIndex) {
        this._x = x;
        this._y = y;
        this._height = height;
        this._width = width;
        this._url = Url;
        this._startIndex = Math.floor(Math.random()*3)*40;
        this._duration = 80;
        this._changeX = Math.random() * 600 - 300;
        this._changeY = Math.random() * 600 - 300;
        this._angle = (Math.random() * 2 - 1) * Math.PI;
        this._styleIndex = Math.floor(Math.random() * 3);
        this._endIndex = 401;
        this.loadImg();
    }
    var p = CreateImg.prototype;
    p.loadImg = function () {
        this._img = new Image();
        this._img.src = this._url;
    }
    p.drawImg = function (context, index) {
        // console.log(1);
        // img.onload = function () {
        switch (this._styleIndex) {
            case 0:
                if (index - this._startIndex >= 0 && index - this._startIndex <= this._duration) {
                    context.save();
                    context.translate(this._x - this._changeX, this._y - this._changeY);
                    context.rotate(this._angle * (this._duration + this._startIndex - index) / this._duration);
                    context.drawImage(this._img, this._changeX, this._changeY, this._width, this._height);
                    context.restore();
                } else if (index - this._startIndex > this._duration && index - this._startIndex < this._endIndex) {
                    context.save();
                    context.translate(this._x - this._changeX, this._y - this._changeY);
                    context.drawImage(this._img, this._changeX, this._changeY, this._width, this._height);
                    context.restore();
                }
                break;
            case 1:
                if (index - this._startIndex >= 0 && index - this._startIndex <= this._duration) {
                    context.save();
                    context.translate(this._x, this._y);
                    context.globalAlpha = (index - this._startIndex) / this._duration;
                    context.drawImage(this._img, this._changeX * (this._startIndex + this._duration - index) / this._duration, this._changeY * (this._startIndex + this._duration - index) / this._duration, this._width, this._height);
                    context.restore();
                } else if (index - this._startIndex > this._duration && index - this._startIndex < this._endIndex) {
                    context.save();
                    context.translate(this._x, this._y);
                    context.globalAlpha = (index - this._startIndex) / this._duration;
                    context.drawImage(this._img, 0, 0, this._width, this._height);
                    context.restore();
                }
                break;
            case 2:
                if (index - this._startIndex >= 0 && index - this._startIndex <= this._duration) {
                    context.save();
                    context.translate(this._x - this._width / 2, this._y - this._height / 2);
                    context.scale(this._duration / ((index - this._startIndex) / 4 + 60), this._duration / ((index - this._startIndex) / 4 + 60));
                    context.drawImage(this._img, this._width / 2, this._height / 2, this._width, this._height);
                    context.restore();
                } else if (index - this._startIndex > this._duration && index - this._startIndex < this._endIndex) {
                    context.save();
                    context.translate(this._x - this._width / 2, this._y - this._height / 2);
                    context.drawImage(this._img, this._width / 2, this._height / 2, this._width, this._height);
                    context.restore();
                }
                break;
            default:
                break;
        }
        // }
    }
    zsj.CreateImg = CreateImg;
})();