window.Util = window.Util || {};
(function () {
    function FileReader(bindDom, playerDom) {
        this._bindDom = bindDom;
        this._playerDom = playerDom;
        this.delegateEvent = {};
        this.init();
    }
    FileReader.prototype = {
        init: function () {
            this._textlist = {};
            this._imglist = {};
            this._audiolist = {};
            this._videolist = {};
            this._textIndex = 0;
            this._imageIndex = 0;
            this._audioIndex = 0;
            this._videoIndex = 0;
            var that = this;
            if (!window.FileReader) {
                alert("Not supported by your browser!");
                return;
            }
            that._bindDom.addEventListener('dragover', function (e) {
                e.preventDefault();
                // that.dragOver(e);
            });
            that._bindDom.addEventListener('drop', function (e) {
                e.preventDefault();
                that.dropOver(e);
            });
        },
        uninit: function () {
            this._textlist = {};
            this._imglist = {};
            this._audiolist = {};
            this._videolist = {};
            this._textIndex = 0;
            this._imageIndex = 0;
            this._audioIndex = 0;
            this._videoIndex = 0;
        },
        dragOver: function (e) {
            var that = this;
            if (that.delegateEvent.dragOverComplete) {
                that.delegateEvent.dragOverComplete();
            }
        },
        dropOver: function (e) {
            var that = this;
            var files = e.dataTransfer.files;
            for (var i = 0; i < files.length; i++) {
                (function (i, file) {
                    that.fileRead(i, file);
                })(i, files[i]);
            }

            if (that.delegateEvent.dropOverComplete) {
                that.delegateEvent.dropOverComplete();
            }
        },
        fileRead: function (i, file) {
            var that = this;

            console.log(file.type)
            switch (file.type) {
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/png':
                    var reader = new window.FileReader();
                    reader.onload = function (e) {
                        var fileObj = file;
                        fileObj.url = e.target.result;
                        fileObj.index=that._imageIndex;
                        that._imglist[that._imageIndex] = fileObj;
                        that._imageIndex++;
                        if(that.delegateEvent.imageComplete){
                            that.delegateEvent.imageComplete.call(this,fileObj);
                        }
                    };
                    reader.readAsDataURL(file);
                    break;
                case 'audio/mp3':
                case 'audio/wav':
                    var reader = new window.FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        var fileObj = file;
                        fileObj.url = e.target.result;
                        fileObj.index = that._audioIndex;
                        that._audiolist[that._audioIndex]=fileObj;
                        that._audioIndex++;
                        if(that.delegateEvent.audioComplete){
                            that.delegateEvent.audioComplete.call(this,fileObj);
                        }
                    };
                    break;
                case 'video/webm':
                case 'video/mp4':
                case 'video/mpeg':
                    var reader = new window.FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        var fileObj = file;
                        fileObj.url = e.target.result;
                        var name=fileObj.name;
                        fileObj.rname=name.split('.')[0];
                        fileObj.index = that._videoIndex;
                        that._videolist[that._videoIndex]=fileObj;
                        that._videoIndex++;
                        if(that.delegateEvent.videoComplete){
                            that.delegateEvent.videoComplete.call(that,fileObj);
                        }
                    };
                    break;
                case 'text/plain':
                case 'text/html':
                    console.log('暂不支持');
                    break;
                default:
                    console.log('请输入常规格式');
                    break;

            }
        }
    }

    window.Util.FileReader = FileReader;
})();