Ext.define('netcam.view.CamerasList', {
    extend: 'Ext.Container',
    name: 'camerasListView',
    id: 'camerasListView',
    requires: [
        'Ext.dataview.List',
        'Ext.plugin.PullRefresh',
        'netcam.view.CameraView'
    ],
    config: {
        layout:
        {
            type: 'fit'
        },
        listeners: {
            activate: function(newScreen, parent, oldScreen)
            {
                jsonGetCameras(null);
            }
        },
        items:
            [{
                xtype: 'list',
                pinHeaders: false,
                loadingText: "Loading Sources...",
                emptyText: '<div class="none">List is empty.</div>',
                onItemDisclosure: true,
                title: 'Cameras List',
                plugins: [
                    {
                        xclass: 'Ext.plugin.PullRefresh',
                        pullText: 'Pull down to refresh!',
                        releaseRefreshText: 'Release to refresh list!',
                        listeners:{
                            latestfetched: function(eOpts) {
                                setTimeout(function(){
                                    jsonGetCameras(null);
                                }, 100);

                            }

                        }
                    }
                ],
                /*itemHeight: 90,*/
                variableHeights: true,
                itemTpl: '<div class="cameraDiv"><div class="cameraPreview t{Id}"></div><div class="cameraText"><div class="list-item-title">Source #{Id}</div><div class="list-item-narrative">{SourceName}</div></div></div>',
                store: 'CamerasStore',
                listeners:{
                    itemtap: function(record, index){
                        currentCameraIndex = index;

                        var mainShare = Ext.getCmp('mainPanel');
                        var itemPanel = Ext.getCmp('cameraView');

                        if (itemPanel == undefined)
                        {
                            itemPanel = new netcam.view.CameraView();
                            Ext.Viewport.add(itemPanel);
                        }

                        //activeView = Ext.Viewport.getActiveItem();
                        Ext.Viewport.animateActiveItem(itemPanel, {type:'slide', direction:'left'});
                    }
                }
            }]
    },
    show: function() {
        this.callParent();
    }
    
});
