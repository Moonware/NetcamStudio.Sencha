Ext.define('netcam.view.ConnectedUsersList', {
    extend: 'Ext.Container',
    name: 'connectedUsersListView',
    id: 'connectedUsersListView',
    requires: [
        'Ext.dataview.List',
        'Ext.plugin.PullRefresh',
        'netcam.view.ItemView'
    ],
    config: {
        layout:
        {
            type: 'fit'
        },
        listeners: {
            activate: function(newScreen, parent, oldScreen)
            {
                console.log('ConnectedUsersList View activated.');

                //Ext.getStore('ConnectedUsersStore').removeAll();
                jsonGetConnectedUsers(null);
                //Ext.getStore('ConnectedUsersStore').sync();
            },
            deactivate : function(newScreen, parent, oldScreen)
            {
                console.log('ConnectedUsersList View deactivated.');
            }
        },
        items:
            [{
                xtype: 'list',
                pinHeaders: false,
                loadingText: "Loading Users...",
                emptyText: '<div class="none">List is empty.</div>',
                onItemDisclosure: false,
                title: 'Connected Users',
                itemHeight: 75,
                /*variableHeights: true,*/
                plugins: [
                    {
                        xclass: 'Ext.plugin.PullRefresh',
                        pullText: 'Pull down to refresh list!',
                        releaseRefreshText: 'Release to refresh list!',
                        listeners:{
                            latestfetched: function(eOpts) {
                                setTimeout(function()
                                {
                                    //Ext.getStore('ConnectedUsersStore').removeAll();
                                    jsonGetConnectedUsers(null);
                                    //Ext.getStore('ConnectedUsersStore').sync();
                                }, 100);
                            }
                        }
                    }
                ],

                itemTpl: '<div class="userDiv"><div class="none"><div class="userIcon" ><img src="{[getUserIcon(values.UserIcon)]}" width="32px" height="32px" class="userIconBitmap"></div><div class="eventText"><div class="list-item-title">{UserName}</div><div class="list-item-narrative">{HostName} - {CountryName} - {[dateToStr(values.SessionStarted)]} - {[formatSpeed(values.TransferRate)]}</div></div></div></div>',
                store: 'ConnectedUsersStore'
            }]
    },
    show: function() {
        this.callParent();
    }
    
});

