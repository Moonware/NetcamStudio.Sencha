Ext.define('netcam.view.Main', {
    extend: 'Ext.tab.Panel',
    id: 'mainPanel',
    name: 'mainPanel',
    requires: [
        'netcam.view.CamerasList',
        'netcam.view.ItemsList',
        'netcam.view.ConnectedUsersList',
        'netcam.view.EventLogsList',
        'netcam.view.About'
    ],
    config: {
        fullscreen: true,
        tabBarPosition: 'bottom',
        tabBar: {
            scrollable:
            {
                direction: 'horizontal'
            }
        },
        listeners: {
            activate: function(newScreen, parent, oldScreen)
            {
                //console.log('Main View activated.');

                this.fireEvent('activated', this);
            }
            /*,
            deactivate : function(newScreen, parent, oldScreen)
            {
                console.log('Main View deactivated.');
            }*/
        },
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            id: 'mainHeader',
            name: 'mainHeader',
            cls: 'header'
        },
        {
            xclass: 'netcam.view.CamerasList',
            iconCls : 'iconCamera',
            title : 'Cameras'
        }
        ,
        {
            xclass: 'netcam.view.ItemsList',
            iconCls : 'iconItem',
            title : 'Library'
        }
        ,
        {
            xclass: 'netcam.view.ConnectedUsersList',
            iconCls : 'iconUsers',
            title : 'Users'
        }
        ,
        {
            xclass: 'netcam.view.EventLogsList',
            iconCls : 'iconLogs',
            title : 'Event Logs'
        }
        ,
        {
            xclass: 'netcam.view.About',
            iconCls : 'iconAbout',
            title : 'About'
        }

        ]
    },
    initialize: function()
    {
        //console.log('Main View Initialize');
        jsonGetLastItems(null, librarySource, libraryItemsToDisplay);
        jsonGetConnectedUsers(null);
        this.callParent();
    },
    show: function()
    {
        this.callParent();
    }
});