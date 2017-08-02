(function () {


    var videoDom = document.getElementById('videoConrainer');
    var playerDom = document.getElementById('videoPlayer');
    var fReader = new window.Util.FileReader(videoDom, playerDom);
    var vPlayer = new window.Util.VideoPlayer(playerDom);
    var curTimeInterval = null;
    var curIndex = 's1';

    fReader.delegateEvent = {
        videoComplete: function (fileObj) {
            var item = $('<span class="localItem boxItem"><span data-index="' + fileObj.index + '" class="itemName">' + fileObj.rname + '</span><i class="itemDel" data-index="' + fileObj.index + '">x</i></span>');
            $('#localListBox').append(item);
        },
        audioComplete: function (fileObj) {
            var item = $('<span class="localItem boxItem"><span data-index="' + fileObj.index + '" class="itemName">' + fileObj.rname + '</span><i class="itemDel" data-index="' + fileObj.index + '">x</i></span>');
            $('#localListBox').append(item);
        }
    }

    var serverList = {
        s1: {
            url: './ShiningMice.mp4',
            rname: 'ShiningMice',
            name: 'ShiningMice.mp4',
            type: 'mp4',
            index: 's1'
        },
        s2: {
            url: './swf.mp4',
            rname: 'swf',
            name: 'swf.mp4',
            type: 'mp4',
            index: 's2'
        }
    }

    var curVol = 1;
    var curVideoValue = 1;

    addEvents();
    loadServerVideo();

    function addEvents() {
        // ===
        $('.show').on('click', function () {
            if ($('#listContainer').hasClass('width-0')) {
                $('.leftContainer').css('width', '80%');
                $('#listContainer').removeClass('width-0').addClass('rcwidth1');

            } else {
                $('.leftContainer').css('width', '100%');
                $('#listContainer').removeClass('rcwidth1').addClass('width-0');
            }
        })

        //===
        $('#videoPlay').on('click', function () {
            vPlayer.vplay();
            $(this).hide();
            $('#videoPause').show();
            startSetCurTime();
            if (curIndex.match('s')) {
                var rname = serverList[curIndex].rname;
                $('#videoName').html(rname);
            } else {
                var rname = fReader._videolist[curIndex].rname;
                $('#videoName').html(rname);
            }
        })
        $('#videoPause').on('click', function () {
            vPlayer.vpause();
            $(this).hide();
            $('#videoPlay').show();
            stopSetCurTime();
        })
        $('#videoEnd').on('click', function () {
            vPlayer.vload();
            vPlayer.vpause();
            $('#videoPause').hide();
            $('#videoPlay').show();
            stopSetCurTime();
        })
        $('#videoEnd').on('click', function () {
            vPlayer.vload();
            vPlayer.vpause();
            $('#progressDis').css('width','0%');
            $('#videoPause').hide();
            $('#videoPlay').show();
        })
        $('#videoVal').on('click', function () {
            vPlayer.setItem('muted', true);
            $(this).hide();
            $('#videoNoval').show();
            $('#valRange input').val(0);
        })
        $('#videoNoval').on('click', function () {
            vPlayer.setItem('muted', false);
            $(this).hide();
            $('#videoVal').show();
            $('#valRange input').val(curVol);
            $('#valRange input').trigger('change');
        })
        $('#valRange input').on('change', function () {
            var vol = $(this).val();
            curVol = vol;
            vPlayer.setItem('volume', vol);
            if (vPlayer.getItem('muted')) {
                vPlayer.setItem('muted', false);
                $('#videoNoval').hide();
                $('#videoVal').show();
            }
        })
        $('#videoFull').on('click', function () {
            vPlayer.vfull();
        })
        $('#progressBar').on('click',function(e){
            var percent=e.offsetX/$(this).width();
            var curDuration=Math.floor(percent*vPlayer.getItem('duration'));
            vPlayer.setItem('currentTime',curDuration);
            $('#curTime').html(formatSeconds(curDuration));
            $('#progressDis').css('width',(percent*100).toFixed(2)+'%');
        })

        $(playerDom).on('durationchange', function () {
            loadTime();
        })
        $(playerDom).on('ended', function () {
            $('#videoEnd').trigger('click');
        })
        $('#localList').on('click', function () {
            if ($('#localListBox').css('height') != '0px') {
                $('#localListBox').css('height', '0');
            } else {
                $('#localListBox').css('height', 'auto');
            }

        })
        $('#serverList').on('click', function () {
            if ($('#serverListBox').css('height') != '0px') {
                $('#serverListBox').css('height', '0');
            } else {
                $('#serverListBox').css('height', 'auto');
            }
        })
        $('#localListBox').on('click', '.itemName', function (e) {
            var index = $(this).attr('data-index');
            curIndex = index;
            var url = fReader._videolist[index].url;
            $(playerDom).attr('src', url);
            playerDom.load();
            $('#videoPlay').trigger('click');
        })
        $('#localListBox').on('click', '.itemDel', function (e) {
            var index = $(this).attr('data-index');
            $(this).parent('.localItem').remove();
            delete fReader._videolist[index];
        })
        $('#serverListBox').on('click', '.itemName', function (e) {
            var index = $(this).attr('data-index');
            curIndex = index;
            var url = serverList[index].url;
            $(playerDom).attr('src', url);
            playerDom.load();
            $('#videoPlay').trigger('click');
        })
        $('#serverListBox').on('click', '.itemDel', function (e) {
            var index = $(this).attr('data-index');
            $(this).parent('.serverItem').remove();
        })
        $('.videoValue1x').on('click', function () {
            if ($(this).hasClass('curVideoValue')) {
                return;
            } else {
                $('.videoValue2x').removeClass('curVideoValue');
                $(this).addClass('curVideoValue');
                vPlayer.setItem('defaultPlaybackRate', 1);
                vPlayer.setItem('playbackRate', 1);
            }
        })
        $('.videoValue2x').on('click', function () {
            if ($(this).hasClass('curVideoValue')) {
                return;
            } else {
                $('.videoValue1x').removeClass('curVideoValue');
                $(this).addClass('curVideoValue');
                vPlayer.setItem('defaultPlaybackRate', 2);
                vPlayer.setItem('playbackRate', 2);
            }
        })

    }

    function loadServerVideo() {
        for (var k in serverList) {
            var index = k;
            var fileObj = serverList[k];
            var item = $('<span class="serverItem boxItem"><span data-index="' + fileObj.index + '" class="itemName">' + fileObj.rname + '</span><i class="itemDel" data-index="' + fileObj.index + '">x</i></span>');
            $('#serverListBox').append(item);
        }
    }

    function loadTime() {
        var totalTime = Math.floor(vPlayer.getItem('duration'));
        $('#totalTime').html(formatSeconds(totalTime));
    }
    function startSetCurTime() {
        if (!curTimeInterval) {
            curTimeInterval = setInterval(function () {
                var curTime = Math.floor(vPlayer.getItem('currentTime'));
                var totalTime = Math.floor(vPlayer.getItem('duration'));
                var percent=(curTime/totalTime*100).toFixed(2)+'%';
                console.log(percent);
                $('#progressDis').css('width',percent);
                $('#curTime').html(formatSeconds(curTime));
            }, 500);
        }
    }
    function stopSetCurTime() {
        if (curTimeInterval) {
            clearInterval(curTimeInterval);
        }
        curTimeInterval = null;
    }

    function formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }

        var result = "" + (parseInt(theTime) < 10 ? ('0' + parseInt(theTime)) : parseInt(theTime));
        result = "" + (parseInt(theTime1) < 10 ? ('0' + parseInt(theTime1)) : parseInt(theTime1)) + ":" + result;
        result = "" + (parseInt(theTime2) < 10 ? ('0' + parseInt(theTime2)) : parseInt(theTime2)) + ":" + result;
        return result;
    }
})();