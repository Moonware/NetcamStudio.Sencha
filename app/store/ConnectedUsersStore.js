Ext.define('netcam.store.ConnectedUsersStore', {
    extend: 'Ext.data.Store',
    requires: [
        'netcam.model.ConnectedUsersModel'
    ],
    config: {
        model: 'netcam.model.ConnectedUsersModel'
    }
});
