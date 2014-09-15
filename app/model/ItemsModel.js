Ext.define('netcam.model.ItemsModel', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'Ext.data.proxy.LocalStorage'
    ],
    xtype: 'itemsmodel',
    config: {
        identifier: {
            type: 'uuid'
        },
        fields: [
            { name: 'Id', type: 'int' },
            { name: 'ItemType', type: 'int' },
            { name: 'SourceId', type: 'int' },
            { name: 'Duration', type: 'string' },
            { name: 'FilenameThumb', type: 'string' },
            { name: 'Filename', type: 'string' },
            { name: 'Synchronized', type: 'bool' },
            { name: 'TimeStamp', type: 'datetime' },
            { name: 'TrigValue', type: 'float' },
            { name: 'DataSize', type: 'int' }
        ],
        proxy: {
            type: 'localstorage',
            id: 'itemproxy'
        }

    }
});

