Ext.define('netcam.model.SettingsModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'Ext.data.proxy.LocalStorage'
    ],
    xtype: 'settingsmodel',
    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
                 'serverId',
                 'serverHost',
                 'serverPort',
                 'serverUsername',
                 'serverPassword',
                 'sessionToken',
                 'sessionTokenTimestamp'
                ],
        proxy: {
            type: 'localstorage',
            id: 'settingsproxy'
        }

    }
});

