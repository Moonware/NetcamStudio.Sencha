Ext.define('netcam.controller.ItemView', {
    extend: 'Ext.app.Controller',           
    requires: [
    	'Ext.MessageBox',
    	'Ext.device.Notification',
        'Ext.Video'
    ],
    config: {
        views: ['ItemView'],
        refs: {
            itemView: '#itemView'
        },
        control: {
            'button[action=itemBack]': {
                tap: 'back'
            },
            'itemView': {
                viewActivate: 'onViewActivate',
                viewDeactivate: 'onViewDeactivate'
            }
        }
    },
    back: function() {
        //Ext.Viewport.animateActiveItem(activeView, {type: 'slide', direction: 'right'});
        Ext.Viewport.animateActiveItem(Ext.getCmp('mainPanel'), {type: 'slide', direction: 'right'});
    },
    onViewActivate: function()
    {
        //var sObject =  Ext.getStore('SettingsStore').getAt(0);
        var iObject =  Ext.getStore('ItemsStore').getAt(currentItemIndex);

        if (iObject != undefined)
        {
            var cItem = iObject.data;

            //Ext.getCmp('itemViewTitle').setTitle('#' + cItem.Id );
            //Ext.getCmp('itemViewTitle').setTitle(dateToStr(cItem.TimeStamp) + ' -  #' + cItem.SourceId);

        }

        this.renderScreen();
    },
    onViewDeactivate: function()
    {

    },
    renderScreen: function()
    {
        try {

            var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

            var iObject =  Ext.getStore('ItemsStore').getAt(currentItemIndex);

            if (iObject != undefined)
            {
                var iItem = iObject.data;

                var previewUrl = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Library/Thumb/' + iItem.Id + '?authToken=' + currentSettings.data.sessionToken;
                var fullUrl = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Library/' + iItem.Id + '?authToken=' + currentSettings.data.sessionToken;

                console.log('Video URL >> ' + fullUrl);

                iView = Ext.getCmp('itemView');
                iView.setData({
                    id: iItem.Id,
                    timeStamp: iItem.TimeStamp,
                    fileName: iItem.Filename,
                    itemType: iItem.ItemType,
                    duration: (iItem.Duration / 1000).toFixed(1) + 's',
                    previewUrl : previewUrl,
                    fullUrl : fullUrl
                });

                var srcWidth = 640;
                var srcHeight = 480;

                var sWidth = Ext.Viewport.getWidth();
                var sHeight = Ext.Viewport.getWidth();

                sWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                sHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;

                while (srcWidth > (sWidth - 10))
                {
                    srcWidth = srcWidth * 0.99;
                    srcHeight = srcHeight * 0.99;
                }

                var cHeight = srcHeight;

                var cObject =  Ext.getStore('CamerasStore').getAt(iItem.SourceId);
                if (cObject != undefined)
                {
                    var sWidth = cObject.data.Width;
                    var sHeight = cObject.data.Height;

                    cHeight = sHeight * (srcWidth / sWidth);
                }

                Ext.getCmp('itemViewVideoPanel').setWidth(srcWidth);
                Ext.getCmp('itemViewVideoPanel').setHeight(cHeight);

                var htmlContent = '<video id="liveVideo" class="video-js vjs-default-skin" controls preload="none" width="' + srcWidth + '" height="' + cHeight + '"';
                htmlContent += 'poster="' + previewUrl + '"';
                htmlContent += 'data-setup="{}">';
                htmlContent += '<source src="' + fullUrl + '" type="video/mp4" />';
                //htmlContent += '<source src="http://video-js.zencoder.com/oceans-clip.webm" type="video/webm" />';
                //htmlContent += '<source src="http://video-js.zencoder.com/oceans-clip.ogv" type="video/ogg" />';
                htmlContent += '</video>';

                Ext.getCmp('itemViewVideoPanel').setHtml(htmlContent);
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

