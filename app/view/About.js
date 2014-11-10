Ext.define('netcam.view.About', {
    extend: 'Ext.Container',
    id: 'aboutView',
    name: 'aboutView',
    config: {
        scrollable: true,
        styleHtmlContent: true,
        listeners: {
            activate: function(newScreen, parent, oldScreen)
            {
                console.log('About View activated.');
                $('#mainHeader').hide();
            },
            deactivate : function(newScreen, parent, oldScreen)
            {
                console.log('About View deactivated.');
                $('#mainHeader').show();
            }
        },
        items: [
        {
            xtype: 'toolbar',
            ui: 'neutral',
            docked: 'top',
            scrollable:null,
            defaults: { ui: 'plain'},
            items: [
                {
                    xtype: 'spacer'
                },
                {
                    iconCls: 'iconFacebook',
                    action:'facebook',
                    hidden:'true'
                },
                {
                    iconCls: 'iconLogout',
                    action:'logout'
                }
            ],
            layout: {
                pack:'start',
                align: 'center'
            }
        }
        ],
        tpl: Ext.XTemplate([
            '<div class="list-item-normal"><img src="resources/images/header/logo.png" width="60%"></div>',
            '<div class="list-item-normal"></div>',
            '<div class="list-item-validity">Netcam Studio Mobile</div>',
            '<div class="list-item-small">{version}</div><br/>',
            '<div class="list-item-small"></div>',
            '<div class="list-item-small"></div><br/>',
            '<div class="list-item-small"></div><br/>',
            '<div class="list-item-normal">&copy; Copyright 2014 Moonware Studios<br /><br />All rights reserved.</div>'
        ])

    },
    show: function() {
        this.callParent();
        this.setData({ version: '2.7.0' });
    }

});
