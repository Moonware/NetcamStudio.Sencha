Ext.define('netcam.store.SettingsStore', {
    extend: 'Ext.data.Store',
    requires: [
        'netcam.model.SettingsModel'
    ],
    config: {
        model: 'netcam.model.SettingsModel'
    }
});
