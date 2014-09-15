Ext.define('netcam.model.ConnectedUsersModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'Ext.data.proxy.LocalStorage'
    ],
    xtype: 'connectedusersmodel',
    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
            { name: 'Id', type: 'int' },
            { name: 'AuthenticationMode', type: 'string' },
            { name: 'UserName', type: 'string' },
            { name: 'HostName', type: 'string' },
            { name: 'CountryISO', type: 'string' },
            { name: 'CountryName', type: 'string' },
            { name: 'CityName', type: 'string' },
            { name: 'SessionStarted', type: 'datetime' },
            { name: 'UserIcon', type: 'string' },
            { name: 'LastWebFileRequest', type: 'datetime' },
            { name: 'FailedWebRequests', type: 'int' },
            { name: 'NumWebRequests', type: 'int' },
            { name: 'LastWCFCommandRequest', type: 'datetime' },
            { name: 'LastWCFCommand', type: 'string' },
            { name: 'NumWCFRequests', type: 'int' },
            { name: 'BytesTransfered', type: 'int' },
            { name: 'IsAuthenticated', type: 'bool' },
            { name: 'TransferRate', type: 'int' }
        ],
        proxy: {
            type: 'localstorage',
            id: 'connecteduserproxy'
        }

    }
});

