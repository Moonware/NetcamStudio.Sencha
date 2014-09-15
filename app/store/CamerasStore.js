Ext.define('netcam.store.CamerasStore', {
    extend: 'Ext.data.Store',
    requires: [
        'netcam.model.CamerasModel'
    ],
    config: {
        model: 'netcam.model.CamerasModel'
    }
});
