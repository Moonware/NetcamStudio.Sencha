Ext.define('netcam.view.Login', {
    extend: 'Ext.Container',
	requires: [
        'Ext.Label',
        'Ext.form.FieldSet',
        'Ext.dataview.DataView',
        'Ext.data.ArrayStore',
        'Ext.data.reader.Array',
        'Ext.field.Password'
    ],
    name: 'loginView',
    id: 'loginView',
    config: {
        scrollable: true,
        padding: '0 5 0 5',
        listeners: {
            activate: function(newScreen, parent, oldScreen)
            {
                //console.log('Login View activated.');

                this.fireEvent('activated', this);
            }
        },
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                cls: 'header'
            },
            {
                xtype: 'title',
                title: 'Please enter server and credentials',
                id: 'loginTitle',
                cls : 'infoLabel'
            },
            {
                xtype: 'fieldset',
                name: 'loginForm',
                defaults: {labelWidth: '45%'},
                items: [
                    {
                        xtype: 'textfield',
                        name: 'loginServerHost',
                        id: 'loginServerHost',
                        placeHolder: '192.168.1.10',
                        value: '',
                        clearIcon: true,
                        label: 'Server Host/IP'
                    },
                    {
                        xtype: 'textfield',
                        name: 'loginServerPort',
                        id: 'loginServerPort',
                        placeHolder: '8100',
                        value: '8100',
                        label: 'Port',
                        hidden: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'loginUsername',
                        id: 'loginUsername',
                        placeHolder: 'admin',
                        value: '',
                        clearIcon: true,
                        label: 'Username'
                    },
                    {
                        xtype: 'passwordfield',
                        name: 'loginPassword',
                        id: 'loginPassword',
                        placeHolder: '1234',
                        value: '',
                        clearIcon: true,
                        label: 'Password'
                    }
                    ,
                    {
                        xtype: 'checkboxfield',
                        name: 'loginSavePassword',
                        id: 'loginSavePassword',
                        label: 'Save Password',
                        checked: false
                    }
                    ,
                    {
                        xtype: 'checkboxfield',
                        name: 'loginAdvanced',
                        id: 'loginAdvanced',
                        action: 'onExpert',
                        label: 'Expert',
                        checked: false
                    }
                ]
            },
            {
                xtype: 'button',
                ui: 'decline',
                text: 'Clear',
                cls: 'vkeyVeryLarge',
                action: 'clearLogin',
                hidden: true
            },
            {
                xtype: 'button',
                ui: 'action',
                text: 'Login',
                cls: 'vkeyVeryLarge',
                action: 'doLogin'
            }
        ]
    },
    show: function()
    {
        this.callParent();
    }
});
