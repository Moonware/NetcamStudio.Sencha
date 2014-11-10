Ext.define('netcam.view.ItemView', {
    extend: 'Ext.Container',
    requires: [
        'Ext.device.Notification',
        'Ext.field.Select',
        'Ext.Video'
    ],
    name: 'itemView',
    id: 'itemView',
    config: {
        scrollable: true,
        styleHtmlContent: true,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            ui: 'neutral',
            id:  'itemViewTitle',
            title: '',
            items: [
                {
                    xtype: 'button',
                    ui: 'back',
                    text: 'Back',
                    action: 'itemBack'
                }
            ]
            },
            {
                xtype: 'panel',
                name: 'tempPanelForPositioningVideoBefore',
                id: 'tempPanel',
                html: '<div></div>'
            }
        ],
        padding: '0 5 0 5',
        listeners: {
                    activate: function(newScreen, parent, oldScreen)
                    {
                        //console.log('Item View activated.');
                        this.fireEvent('viewActivate', this);
                    },
                    deactivate : function(newScreen, parent, oldScreen)
                    {
                        //console.log('Item View deactivated.');
                        this.fireEvent('viewDeactivate', this);
                    }
        },
        tpl: Ext.XTemplate([
            '<tpl for=".">',


            //'<video id="liveVideo" controls preload="none" width="{videoWidth}" height="{videoHeight}" poster="{previewUrl}">',
            //'<source src="{fullUrl}" type="video/mp4" />',
            //'</video>',

            '<div class="checkResults">',
            '<div class="infoTitle">Item Entry</div>',
            '<div class="alert {[itemTypeIdToStr(values.itemType)]}"><div class="alert-text-bold">{[itemTypeIdToStr(values.itemType)]}</div>{[dateToStr(values.timeStamp)]}</div>',

            '<div class="info Duration">',
            '<div class="alert-text-normal"><div class="alert-text t{itemType}">Length: {duration}</div></div>',
            '</div>',

            '<tpl if="generationDate">',
            '</tpl>',

            '</div>',
            '</tpl>'
        ]
        )
    },
    show: function() {
        this.callParent();
    }

});

