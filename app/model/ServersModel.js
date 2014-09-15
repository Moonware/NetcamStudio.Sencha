Ext.define('netcam.model.ServersModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'Ext.data.proxy.LocalStorage'
    ],
    xtype: 'serversmodel',
    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
                    { name: 'serverId', type: 'int' },
                    { name: 'serverTitle', type: 'string' },
                    { name: 'serverHost', type: 'string' },
                    { name: 'serverPort', type: 'int' },
                    { name: 'serverHeaderImage', type: 'string' }
        ],
        proxy: {
            type: 'localstorage',
            id: 'serverproxy'
        }

    }
});

