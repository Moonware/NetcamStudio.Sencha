Ext.define('netcam.view.CameraView', {
    extend: 'Ext.Container',
    name: 'cameraView',
    id: 'cameraView',
	requires: [
        'Ext.Label',
        'Ext.form.FieldSet',
        'Ext.dataview.DataView',
        'Ext.data.ArrayStore',
        'Ext.data.reader.Array',
        'Ext.field.Checkbox'
    ],
    config: {
        scrollable: true,
        listeners: {
            activate: function(newScreen, parent, oldScreen)
            {
                console.log('Camera View activated. Starting Preview');
                this.fireEvent('viewActivate', this);
            },
            deactivate : function(newScreen, parent, oldScreen)
            {
                console.log('Camera View deactivated. Stopping Preview');
                this.fireEvent('viewDeactivate', this);
            }
        },
        padding: '0 5 0 5',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                id: 'cameraViewTitle_disabled',
                title: '',
                hidden:'true',
                items: [
                    {
                        xtype: 'button',
                        ui: 'back',
                        text: 'Back',
                        action: 'cameraBack'
                    }
                ]
            },
            {
                xtype: 'toolbar',
                ui: 'neutral',
                docked: 'top',
                scrollable:null,
                defaults: { ui: 'plain'},
                items: [
                    {
                        xtype: 'button',
                        ui: 'back',
                        text: 'Back',
                        action: 'cameraBack'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        iconCls: 'iconCapture',
                        action:'capturePicture'
                    },
                    {
                        iconCls: 'iconRecord',
                        id: 'cameraViewRecord',
                        name: 'cameraViewRecord',
                        action:'record'
                    },
                    {
                        iconCls: 'iconMotion',
                        id: 'cameraViewMotion',
                        name: 'cameraViewMotion',
                        action:'motion'
                    },
                    {
                        iconCls: 'iconAudio',
                        id: 'cameraViewAudio',
                        name: 'cameraViewAudio',
                        action:'audio'
                    }
                ],
                layout: {
                    pack:'start',
                    align: 'center'
                }
            },
            {
                xtype: 'panel',
                cls: 'ViewPanel',
                name: 'cameraViewLivePanel',
                id: 'cameraViewLivePanel',
                html: '<div id="cDiv"><img id="cameraImg1" class="cameraImg" alt="#1" /><img id="cameraImg2" class="cameraImg" alt="#2" /></div>'
            },
            /*{
                xtype: 'fieldset',
                name: 'cameraForm',
                defaults: {labelWidth: '45%'},
                items: [
                    {
                        xtype: 'selectfield',
                        label: 'Size',
                        hidden:'true',
                        options: [{text:'Full Size', value:0},{text:'320x240', value:2},{text:'200x150', value:1}],
                        listeners: {
                            change: function(field, value) {
                                setPreviewResolution(value);
                            }
                        }
                    },


                ]
            },*/
            {
                xtype: 'panel',
                cls: 'ptzPanel',
                name: 'cameraViewPTZPanel',
                id: 'cameraViewPTZPanel',
                visibility: 'hidden',
                html:
                    '<div class="ptzLine"><div class="ptzDiv"><button class="x-button x-button-action x-button-ptz" onclick="javascript:ptzControl(\'ZoomOut\');"><span class="x-button-icon x-shown iconPTZZoomOut" id="btnPtzZoomOut"></span></button></div><div class="ptzDiv"></div><div class="ptzDiv"><button class="x-button x-button-action x-button-ptz" onclick="javascript:ptzControl(\'ZoomIn\');"><span class="x-button-icon x-shown iconPTZZoomIn" id="btnPtzZoomIn"></span></button></div></div>' +
                    '<div class="ptzLine"><div class="ptzDiv clear"></div><div class="ptzDiv"><button class="x-button x-button-ptz" onclick="javascript:ptzControl(\'Up\');"><span class="x-button-icon x-shown iconPTZUp" id="btnPtzUp"></span></button></div><div class="ptzDiv"></div></div>' +
                    '<div class="ptzLine"><div class="ptzDiv clear"><button class="x-button x-button-ptz" onclick="javascript:ptzControl(\'Left\');"><span class="x-button-icon x-shown iconPTZLeft" id="btnPtzLeft"></span></div><div class="ptzDiv"></div><div class="ptzDiv"><button class="x-button x-button-ptz" onclick="javascript:ptzControl(\'Right\');"><span class="x-button-icon x-shown iconPTZRight" id="btnPtzRight"></span></div></div>' +
                    '<div class="ptzLine"><div class="ptzDiv clear"></div><div class="ptzDiv"><button class="x-button x-button-ptz" onclick="javascript:ptzControl(\'Down\');"><span class="x-button-icon x-shown iconPTZDown" id="btnPtzDown"></span></div><div class="ptzDiv"></div></div>'
            },
            {
                xtype: 'panel',
                cls: 'clear'
            },
            {
                id: 'cameraViewLabel',
                cls: 'ptzPanel',
                html: ''
            }
        ]
    },
    show: function()
    {
        this.callParent();
    }
});
