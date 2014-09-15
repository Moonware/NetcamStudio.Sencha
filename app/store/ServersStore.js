Ext.define('netcam.store.ServersStore', {
    extend: 'Ext.data.Store',
    requires: [
        'netcam.model.ServersModel'
    ],
    config: {
        model: 'netcam.model.ServersModel'
    }
});
