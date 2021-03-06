window.Util = window.Util || {};
(function () {

    // audioTracks	返回表示可用音频轨道的 AudioTrackList 对象。
    // autoplay	设置或返回是否在就绪（加载完成）后随即播放视频。
    // buffered	返回表示视频已缓冲部分的 TimeRanges 对象。
    // controller	返回表示视频当前媒体控制器的 MediaController 对象。
    // controls	设置或返回视频是否应该显示控件（比如播放/暂停等）。
    // crossOrigin	设置或返回视频的 CORS 设置。
    // currentSrc	返回当前视频的 URL。
    // currentTime	设置或返回视频中的当前播放位置（以秒计）。
    // defaultMuted	设置或返回视频默认是否静音。
    // defaultPlaybackRate	设置或返回视频的默认播放速度。
    // duration	返回视频的长度（以秒计）。
    // ended	返回视频的播放是否已结束。
    // error	返回表示视频错误状态的 MediaError 对象。
    // height	设置或返回视频的 height 属性的值。
    // loop	设置或返回视频是否应在结束时再次播放。
    // mediaGroup	设置或返回视频所属媒介组合的名称。
    // muted	设置或返回是否关闭声音。
    // networkState	返回视频的当前网络状态。
    // paused	设置或返回视频是否暂停。
    // playbackRate	设置或返回视频播放的速度。
    // played	返回表示视频已播放部分的 TimeRanges 对象。
    // poster	设置或返回视频的 poster 属性的值。
    // preload	设置或返回视频的 preload 属性的值。
    // readyState	返回视频当前的就绪状态。
    // seekable	返回表示视频可寻址部分的 TimeRanges 对象。
    // seeking	返回用户当前是否正在视频中进行查找。
    // src	设置或返回视频的 src 属性的值。
    // startDate	返回表示当前时间偏移的 Date 对象。
    // textTracks	返回表示可用文本轨道的 TextTrackList 对象。
    // videoTracks	返回表示可用视频轨道的 VideoTrackList 对象。
    // volume	设置或返回视频的音量。
    // width	设置或返回视频的 width 属性的值。

    // addTextTrack()	向视频添加新的文本轨道。
    // canPlayType()	检查浏览器是否能够播放指定的视频类型。
    // load()	重新加载视频元素。
    // play()	开始播放视频。
    // pause()	暂停当前播放的视频。

    function VideoPlayer(playerDom) {
        this._playerDom = playerDom;
    }
    VideoPlayer.prototype = {
        vplay: function () {
            this._playerDom.play();
        },
        vpause: function () {
            this._playerDom.pause();
        },
        vload: function () {
            this._playerDom.load();
        },
        vfull: function () {
            if (this._playerDom.requestFullScreen) {
                this._playerDom.requestFullScreen();
            } else if (this._playerDom.mozRequestFullScreen) {
                this._playerDom.mozRequestFullScreen();
            } else if (this._playerDom.webkitRequestFullScreen) {
                this._playerDom.webkitRequestFullScreen();
            }
        },
        setItem: function (item, value) {
            this._playerDom[item] = value;
        },
        getItem: function (item) {
            return this._playerDom[item];
        }
    }

    window.Util.VideoPlayer = VideoPlayer;
})();