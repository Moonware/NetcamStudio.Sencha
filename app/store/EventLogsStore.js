Ext.define('netcam.store.EventLogsStore', {
    extend: 'Ext.data.Store',
    requires: [
        'netcam.model.EventLogsModel'
    ],
    config: {
        model: 'netcam.model.EventLogsModel'
    }
});
