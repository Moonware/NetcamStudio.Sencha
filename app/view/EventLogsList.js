Ext.define('netcam.view.EventLogsList', {
    extend: 'Ext.Container',
    name: 'eventLogsListView',
    id: 'eventLogsListView',
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
                console.log('EventLogsList View activated.');

                //Ext.getStore('EventLogsStore').removeAll();
                jsonGetEventLogs(null, 50);
                //Ext.getStore('EventLogsStore').sync();
            },
            deactivate : function(newScreen, parent, oldScreen)
            {
                console.log('EventLogsList View deactivated.');
            }
        },
        items:
            [{
                xtype: 'list',
                pinHeaders: false,
                loadingText: "Loading Logs...",
                emptyText: '<div class="none">List is empty.</div>',
                onItemDisclosure: false,
                title: 'Event Logs',
                /*itemHeight: 92,*/
                variableHeights: true,
                plugins: [
                    {
                        xclass: 'Ext.plugin.PullRefresh',
                        pullText: 'Pull down to refresh list!',
                        releaseRefreshText: 'Release to refresh list!',
                        listeners:{
                            latestfetched: function(eOpts) {
                                setTimeout(function()
                                {
                                //Ext.getStore('EventLogsStore').removeAll();
                                jsonGetEventLogs(null, 50);
                                //Ext.getStore('EventLogsStore').sync();
                                }, 100);
                            }
                        }
                    }
                ],
                itemTpl: '<div class="eventDiv"><div class="eventIcon {[criticalityToString(values.Criticality)]}" ></div><div class="eventText"><div class="list-item-title">{Source}</div><div class="list-item-subtitle">{Description}</div><div class="list-item-narrative">{[dateToStr(values.TimeStamp)]}</div></div></div>',
                store: 'EventLogsStore'
            }]
    },
    show: function() {
        this.callParent();
    }
    
});

