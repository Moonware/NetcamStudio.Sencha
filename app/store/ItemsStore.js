Ext.define('netcam.store.ItemsStore', {
    extend: 'Ext.data.Store',
    requires: [
        'netcam.model.ItemsModel'
    ],
    config: {
        model: 'netcam.model.ItemsModel'
    }
});
