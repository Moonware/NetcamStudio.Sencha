Ext.define('netcam.model.EventLogsModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'Ext.data.proxy.LocalStorage'
    ],
    xtype: 'eventlogsmodel',
    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
            { name: 'Id', type: 'int' },
            { name: 'Criticality', type: 'int' },
            { name: 'SourceId', type: 'int' },
            { name: 'Source', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'TimeStamp', type: 'datetime' }
        ],
        proxy: {
            type: 'localstorage',
            id: 'eventlogproxy'
        }

    }
});

