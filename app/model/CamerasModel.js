Ext.define('netcam.model.CamerasModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'Ext.data.proxy.LocalStorage'
    ],
    xtype: 'camerasmodel',
    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
                    { name: 'SourceName', type: 'string' },
                    { name: 'SourceUID', type: 'string' },
                    { name: 'Id', type: 'int' },
                    { name: 'SourceUrl', type: 'string' },
                    { name: 'VideoSourceProvider', type: 'netcam.Model.VideoSourceProviderModel' },
                    { name: 'Plugins', type: 'netcam.Model.PluginsModel' },
                    { name: 'Status', type: 'netcam.Model.StatusModel' },
                    { name: 'Height', type: 'int' },
                    { name: 'Width', type: 'int' }
                    //{ name: 'HasAudio', type: 'bool' } -> Part of status
        ],
        proxy: {
            type: 'localstorage',
            id: 'cameraproxy'
        }

    }
});

