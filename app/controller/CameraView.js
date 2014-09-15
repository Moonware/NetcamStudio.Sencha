Ext.define('netcam.controller.CameraView', {
    extend: 'Ext.app.Controller',
    requires: [
    	'Ext.MessageBox',
    	'Ext.device.Notification'
    ],
    config: {
        views: ['CameraView'],
        refs: {
            cameraView: '#cameraView'
        },
        control: {
            'button[action=cameraBack]': {
                tap: 'back'
            },
            'button[action=switchVideo]': {
                tap: 'switchVideo'
            },
            'button[action=capturePicture]': {
                tap: 'capturePicture'
            },
            'button[action=record]': {
                tap: 'switchRecording'
            },
            'button[action=motion]': {
                tap: 'switchMotion'
            },
            'button[action=audio]': {
                tap: 'switchAudio'
            },
            'cameraView': {
                viewActivate: 'onViewActivate',
                viewDeactivate: 'onViewDeactivate'
            }
        }
    },
    back: function() {
        console.log('back pressed...');
        //Ext.Viewport.animateActiveItem(activeView, {type: 'slide', direction: 'right'});
        Ext.Viewport.animateActiveItem(Ext.getCmp('mainPanel'), {type: 'slide', direction: 'right'});
    },
    switchVideo: function() {
        // Update HTML dynamically

        videoMode = 1 - videoMode;

        var panel = Ext.getCmp('cameraViewLivePanel');

        var htmlContent =  '<h1>No Video Mode selected.</h1>';

        var sObject =  Ext.getStore('SettingsStore').getAt(0);
        var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

        if (cObject != undefined)
        {
            var cItem = cObject.data;

            var streamPath = cItem.SourceUrl;
            streamPath = streamPath.replace("{server}",  cItem.serverHost);
            streamPath = streamPath.replace("{port}",  cItem.serverPort);
            streamPath = streamPath.replace("{urlSuffix}",  'Live');
            streamPath = streamPath.replace("{camId}",   cItem.Id);
            streamPath = streamPath.replace("{resolution}",   0);

            var imagePath = cItem.SourceUrl;

            imagePath = imagePath.replace("{server}",  cItem.serverHost);
            imagePath = imagePath.replace("{port}",  cItem.serverPort);
            imagePath = imagePath.replace("{urlSuffix}",  'Jpeg');
            imagePath = imagePath.replace("{camId}",   cItem.Id);
            imagePath = imagePath.replace("{resolution}",   0);

            if (videoMode == 1)
            {
                stopPreview();

                htmlContent = '<video id="formVideo1" class="formVideo" controls autoplay poster="' + imagePath + '">';
                htmlContent += '<source src="' + streamPath + '" type="video/ogg">';
                htmlContent += 'Your browser does not support the video tag.';
                htmlContent += '</video>';
            }

            if (videoMode == 0)
            {
                var video=document.getElementById("formVideo1");
                if (video != undefined)
                {
                    video.pause();
                }

                htmlContent = '<img id="formImg1" class="formImg" alt="#1" /><img id="formImg2" class="formImg" alt="#2" />';
                startPreview();
            }
        }

        panel.setHtml(htmlContent);

        // Forces to reapply css
        updatePreviewSize();

    },
    capturePicture: function()
    {
        var currView = Ext.getCmp('cameraView');

        jsonCapturePicture(currView, currentCameraIndex);
    },
    switchRecording: function()
    {
        var currView = Ext.getCmp('cameraView');

        var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

        // Start
        if (cObject.data.Status.IsRecording == false)
        {
            jsonStartStopRecording(currView, currentCameraIndex, 'true');
        }
        else
        {
            jsonStartStopRecording(currView, currentCameraIndex, 'false');
        }

    },
    switchMotion: function()
    {
        var currView = Ext.getCmp('cameraView');

        var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

        // Start
        if (cObject.data.Status.IsMotionDetector == false)
        {
            jsonStartStopMotionDetector(currView, currentCameraIndex, true);
        }
        else
        {
           jsonStartStopMotionDetector(currView, currentCameraIndex, false);
        }

    },
    switchAudio: function()
    {
        var needPlay = !this.aPlaying;

        // Try to stop in all cases
        if ((this.aPlayer != undefined) && (this.aPlayer != null))
        {
            //if (this.aPlaying)
            {
                this.aPlayer.stop();
                this.aPlaying = false;
            }

            soundManager.unload('aSound');
            soundManager.destroySound('aSound');


            console.log('Audio player stopped...');
        }

        if (needPlay)
        {
            try
            {
                this.aPlaying = true;

                this.aPlayer = soundManager.createSound({
                    id: 'aSound',
                    url: this.aPlayerUrl
                });

                this.aPlayer.play();

                console.log('Audio player started >> ' + this.aPlayerUrl);
            }
            catch (err)
            {
                console.log('Start Audio Exception: ' + err);
            }
        }

        if (this.aPlaying)
        {
            Ext.getCmp('cameraViewAudio').setUi('action');
        }
        else
        {
            Ext.getCmp('cameraViewAudio').setUi('plain');
        }

    },
    onViewActivate: function()
    {
        // Forces to reapply css
        updatePreviewSize();
        startPreview();

        //if ((this.aPlaying = undefined) || (this.aPlaying = null))
        //{
        //    this.aPlaying = false;
        //}

        var sObject =  Ext.getStore('SettingsStore').getAt(0);
        var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

        if (cObject != undefined)
        {
            var cItem = cObject.data;

            if (Ext.getCmp('cameraViewLabel') != undefined)
            {
                Ext.getCmp('cameraViewLabel').setHtml('Source #' + cItem.Id + " - " + cItem.SourceName);
            }

            var hasPTZ = false;
            var hasAudio = false;

            if ((cItem.Status != undefined) && (cItem.Status.HasPTZ != undefined))
            {
                hasPTZ = cItem.Status.HasPTZ;
            }

            // DEBUG >> Force Audio Enabled
            // cItem.Status.HasAudio = true;

            var ptzPanel = Ext.getCmp('cameraViewPTZPanel');

            if ((cItem.Status != undefined) && (cItem.Status.HasAudio != undefined))
            {
                hasAudio = cItem.Status.HasAudio;

                if (hasAudio)
                {
                    var now = new Date();
                    var ticks = now.getTime();
                    var imagePath = cItem.SourceUrl + '&r=' + ticks;

                    imagePath = imagePath.replace("{server}",  sObject.data.serverHost);
                    imagePath = imagePath.replace("{port}",  sObject.data.serverPort);
                    imagePath = imagePath.replace("{urlSuffix}",  'Audio');
                    imagePath = imagePath.replace("{camId}",   cItem.Id);
                    imagePath = imagePath.replace("{resolution}",   previewResolution);

                    // Beware, here it's &authToken not ?authToken like all "standard" methods
                    imagePath = imagePath + '&authToken=' + sObject.data.sessionToken;

                    if ((this.aPlayer != undefined) && (this.aPlayer != null))
                    {
                        //if (this.aPlaying)
                        {
                            this.aPlayer.stop();
                            this.aPlaying = false;
                        }

                        soundManager.unload('aSound');
                        soundManager.destroySound('aSound');

                        console.log('Audio player stopped...');
                    }

                    try
                    {
                        this.aPlayer = soundManager.createSound({
                            id: 'aSound',
                            url: imagePath
                        });

                        this.aPlayer.play();
                        this.aPlaying = true;
                        this.aPlayerUrl = imagePath;

                        console.log('Audio player started >> ' + imagePath);
                    }
                    catch (err)
                    {
                        console.log('Start Audio Exception: ' + err);
                    }
                }

            }

            console.log('Camera Status [' + cItem.Id + '] : hasPTZ >> ' + hasPTZ + ' >> hasAudio >> ' + hasAudio);

            ptzPanel.setVisibility(hasPTZ);

            if (cObject.data.Status.IsRecording)
            {
                Ext.getCmp('cameraViewRecord').setUi('decline');
            }
            else
            {
                Ext.getCmp('cameraViewRecord').setUi('plain');
            }

            if (cObject.data.Status.IsMotionDetector)
            {
                Ext.getCmp('cameraViewMotion').setUi('action');
            }
            else
            {
                Ext.getCmp('cameraViewMotion').setUi('plain');
            }

            if (this.aPlaying)
            {
                Ext.getCmp('cameraViewAudio').setUi('action');
            }
            else
            {
                Ext.getCmp('cameraViewAudio').setUi('plain');
            }

            if (cObject.data.Status.HasAudio)
            {
                Ext.getCmp('cameraViewAudio').enable();
            }
            else
            {
                Ext.getCmp('cameraViewAudio').disable();
            }
        }


    },
    onViewDeactivate: function()
    {
        stopPreview();

        if ((this.aPlayer != undefined) && (this.aPlayer != null))
        {
            //if (this.aPlaying)
            {
                this.aPlayer.stop();
                this.aPlaying = false;
            }

            soundManager.unload('aSound');
            soundManager.destroySound('aSound');

            console.log('Audio player stopped...');
        }

    },
    renderScreen: function()
    {
        try {

            var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

            //var sObject =  Ext.getStore('SettingsStore').getAt(0);
            var iObject =  Ext.getStore('ItemsStore').getAt(currentItemIndex);

            if (iObject != undefined)
            {
                var iItem = iObject.data;

                var previewUrl = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Library/Thumb/' + iItem.Id + '?authToken=' + currentSettings.data.sessionToken;
                var fullUrl = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Library/' + iItem.Id + '?authToken=' + currentSettings.data.sessionToken;

                this.setData({
                    id: iItem.Id,
                    timeStamp: iItem.TimeStamp,
                    fileName: iItem.Filename,
                    itemType: iItem.ItemType,
                    duration: iItem.Duration / 1000 + 's',
                    previewUrl : previewUrl,
                    fullUrl : fullUrl
                });

                setTimeout(
                    function()
                    {
                        if ($( ".libraryThumb").css("isLoaded") == undefined)
                        {
                            $( ".libraryThumb").css("isLoaded", "true");
                            $( ".libraryThumb").css("background-image", "url('" + previewUrl + "')");
                        }
                    }
                    , 50);

                console.log('ItemView Show');
            }

        } catch (err) {
            console.log('Error: ' + err);
        }

        if (this.rendered)
        {
            this.getScrollable().getScroller().scrollTo(0, 0, true);
        }
    }

});



