Ext.define('netcam.view.ItemsList', {
    extend: 'Ext.Container',
    name: 'itemsListView',
    id: 'itemsListView',
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
                console.log('ItemsList View activated.');
                $('#mainHeader').hide();
            },
            deactivate : function(newScreen, parent, oldScreen)
            {
                console.log('ItemsList View deactivated.');
                $('#mainHeader').show();
            }
        },
        items:
            [
                {
                    xtype: 'toolbar',
                    ui: 'neutral',
                    docked: 'top',
                    scrollable:null,
                    defaults: { ui: 'plain'},
                    items: [
                        {
                            xtype: 'spacer'
                        },
                        {
                            iconCls: 'iconCamera',
                            handler:function()
                            {
                                if (!this.camPicker) {
                                    this.camPicker = Ext.Viewport.add({
                                        xtype: 'picker',
                                        useTitles: true,
                                        slots: [{
                                            name: 'pickerSlotCamera',
                                            id: 'pickerSlotCamera',
                                            title: 'Source to display',
                                            data:
                                                [
                                                    {text: 'All', value: -1}
                                                ]
                                        }],
                                        listeners: {
                                            change: function (picker, value, oldValue) {

                                                /* The result is contained in slot name, normally value.numItems
                                                 Since setting to a default value doesn't work when a name is set
                                                 We have to retrieve the result in value.null !
                                                 */

                                                librarySource = value.pickerSlotCamera;
                                                jsonGetLastItems(null, librarySource, libraryItemsToDisplay);
                                            }, // change
                                            cancel: function (picker) {
                                                //Ext.Msg.alert('You hit cancel', '');
                                            } // cancel
                                        } // listeners
                                    });

                                }

                                // we refresh the content dynamically based on the cameraStore :)

                                var cameraStore = Ext.getStore('CamerasStore');

                                var dynamicData =
                                    [
                                        {text: "All", value : -1}
                                    ];

                                for (cIdx = 0; cIdx < cameraStore.getCount(); cIdx++) {
                                    var cObject =  cameraStore.getAt(cIdx);
                                    dynamicData.push({text: cObject.data.SourceName, value: cIdx})
                                }

                                this.camPicker.setSlots({
                                    name:'pickerSlotCamera',
                                    id: 'pickerSlotCamera',
                                    title: 'Source to display',
                                    data: dynamicData
                                });

                                this.camPicker.show();
                                Ext.getCmp('pickerSlotCamera').setValue(librarySource);
                            }
                        },
                        {
                            iconCls: 'iconItem',
                            handler:function()
                            {
                                if (!this.picker) {
                                    this.picker = Ext.Viewport.add({
                                        xtype: 'picker',
                                        useTitles: true,
                                        slots: [{
                                                name: 'pickerSlotNumItems',
                                                id: 'pickerSlotNumItems',
                                                title: 'Number of Items',
                                                data:
                                                    [
                                                    {text: '25', value: 25},
                                                    {text: '50', value: 50},
                                                    {text: '100', value: 100},
                                                    {text: '200', value: 200}
                                                    ]
                                            }],
                                        listeners: {
                                            change: function (picker, value, oldValue) {

                                                /* The result is contained in slot name, normally value.numItems
                                                   Since setting to a default value doesn't work when a name is set
                                                   We have to retrieve the result in value.null !
                                                */

                                                libraryItemsToDisplay = value.pickerSlotNumItems;
                                                jsonGetLastItems(null, librarySource, libraryItemsToDisplay);
                                            }, // change
                                            cancel: function (picker) {
                                                //Ext.Msg.alert('You hit cancel', '');
                                            } // cancel
                                        } // listeners
                                    });
                                }

                                this.picker.show();
                                Ext.getCmp('pickerSlotNumItems').setValue(libraryItemsToDisplay);

                            }
                        }
                    ],
                    layout: {
                        pack:'start',
                        align: 'center'
                    }
                },
                {
                xtype: 'list',
                pinHeaders: false,
                loadingText: "Loading Items...",
                emptyText: '<div class="none">List is empty.</div>',
                onItemDisclosure: true,
                title: 'Items List',
                /*itemHeight: 110, */
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
                                    jsonGetLastItems(null, librarySource, libraryItemsToDisplay);
                                }, 100);
                            }
                        }
                    }
                ],
                /*itemTpl: '<div class="itemDiv"><div class="itemPreview t{Id}" ></div><div class="alertTiny {[itemTypeIdToStr(values.ItemType)]}" ></div><div class="itemText"><div class="list-item-title">{[itemTypeIdToStr(values.ItemType)]}</div><div class="list-item-subtitle">{Id}</div><div class="list-item-narrative">{[dateToStr(values.TimeStamp)]}</div></div></div>',*/
                itemTpl: '<div class="itemDiv"><div class="itemPreview t{Id}" ></div><div class="alertTiny {[itemTypeIdToStr(values.ItemType)]}" ></div><div class="itemText"><div class="list-item-title">{[itemTypeIdToStr(values.ItemType)]}</div><div class="list-item-narrative">{[dateToStr(values.TimeStamp)]}</div><div class="list-item-narrative">Duration: {[(values.Duration / 1000).toFixed(1)]}s</div></div></div>',
                store: 'ItemsStore',
                listeners:{
                    itemtap: function(record, index){
                        currentItemIndex = index;

                        var mainShare = Ext.getCmp('mainPanel');
                        var itemPanel = Ext.getCmp('itemView');

                        if (itemPanel == undefined)
                        {
                           itemPanel = new netcam.view.ItemView();
                           Ext.Viewport.add(itemPanel);
                        }

                        //activeView = Ext.Viewport.getActiveItem();
                        Ext.Viewport.animateActiveItem(itemPanel, {type:'slide', direction:'left'});
                    },
                    painted: function( sender, eOpts )
                    {
                        console.log('List [Items] Painted');
                        //setTimeout(applyItemsCss, 100);
                    }
                }
            }]
    },
    show: function() {
        this.callParent();
    }
    
});

