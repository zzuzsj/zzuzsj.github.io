(function () {
    // /*页面初始化*/
    // var portrait = function (c, wd, gh) {
    //     c.width(gh);
    //     c.height(wd);
    //     c.css('top', (gh - wd) / 2);
    //     c.css('left', -(gh - wd) / 2);
    //     c.css('transform', 'rotate(90deg)');
    //     document.body.style.transformOrigin = '' + (gh / 2) + ' ' + (gh / 2);
    // };
    // var landscape = function (d, wd, gh) {
    //     d.width(gh);
    //     d.height(wd);
    //     d.css('top', 0);
    //     d.css('left', 0);
    //     d.css('transform', 'none');
    //     document.body.style.transformOrigin = '' + (gh / 2) + ' ' + (gh / 2);
    // };
    // /*重新计算承载画布框宽高*/
    // var whMaxLandscape = function (gw, gh) {
    //     /** gh为高* gw为宽* gr为头部高度* 横*/
    //     /*计算承载框高度、宽度*/
    //     $("#contentDiv").css({ "width": gh + "px", "height": gw + "px" });
    // };

    // var whMinPortrait = function (gw, gh) {
    //     /** gh为高* gw为宽* gr为头部高度* 竖*/
    //     /*计算承载框高度、宽度*/
    //     $("#contentDiv").css({ "width": gh + "px", "height": gw + "px" });
    // };

    // CYorientationChanged = function (mode, width, height) {
    //     if ("portrait" == mode) {
    //         whMinPortrait(width, height);
    //     }
    //     else if ("landscape" == mode) {
    //         whMaxLandscape(width, height);
    //     }
    // };
    // /*根据设备旋转重置*/
    // var orientation = "landscape";
    // var orientationChanged = function () {
    //     var widthld = document.documentElement.clientWidth;
    //     var heightld = document.documentElement.clientHeight;
    //     if (orientation != "portrait" && widthld < heightld) {
    //         orientation = "portrait";
    //         portrait($("#contentDiv"), widthld, heightld);
    //         CYorientationChanged(orientation, widthld, heightld);
    //     }
    //     if (widthld > heightld) {
    //         orientation = "landscape";
    //         landscape($("#contentDiv"), heightld, widthld);
    //         CYorientationChanged(orientation, heightld, widthld);
    //     }
    // };
    // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationChanged, false);
    // $(window).resize(orientationChanged);

    var ch = window.screen.availWidth;
    var cw = window.screen.availHeight;
    var dom = $('#contentDiv');
    var orientation = '';

    var portrait = function (c, wd, gh) {
        dom.css({
            'position': 'absolute',
            'left': (ch / 2 - cw / 2) + 'px',
            'top': (cw / 2 - ch / 2) + 'px',
            'width': cw + 'px',
            'height': ch + 'px',
            'transform': 'rotate(90deg)',
            'transform-origin': '50% 50%'
        });
    };
    var landscape = function (d, wd, gh) {
        dom.css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': cw + 'px',
            'height': ch + 'px',
            'transform': 'rotate(0deg)',
            'transform-origin': '0 0'
        });
    };
    function windowOrientate(first) {
        var mql = window.matchMedia("(orientation: portrait)").matches;
        console.log(mql);
        console.log(orientation);
        if (!mql) {
            if (first) {
                orientation = 'landscape';
            } else {
                if (orientation == 'landscape') {
                    return;
                }
            }
            orientation = 'landscape';
            landscape();
        } else {
            if (first) {
                orientation = 'portrait';
            } else {
                if (orientation == 'portrait') {
                    return;
                }
            }
            orientation = 'portrait';
            portrait();

        }
    };
    windowOrientate(true);
    // portrait();
    window.addEventListener("resize", function () {
        windowOrientate(false);
    });

    var flappy = new window.Flappy();
    flappy._stageW=cw;
    flappy._stageH=ch;
    flappy.bindStage();
    flappy.init();
    // dom.css({
    //     'position': 'absolute',
    //     'left': (ch / 2 - cw / 2) + 'px',
    //     'top': (cw / 2 - ch / 2) + 'px',
    //     'width': cw + 'px',
    //     'height': ch + 'px',
    //     'transform': 'rotate(90deg)',
    //     'transform-origin': '50%50%'
    // });


})();