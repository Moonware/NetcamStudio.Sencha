Ext.define('netcam.controller.Login', {
    extend: 'Ext.app.Controller',           
    requires: [
    	'Ext.MessageBox',
    	'Ext.device.Notification'
    ],
    config: {
        views: ['Login'],
        refs: {
            loginView: '#loginView'
        },
        control: {
            'button[action=clearLogin]': {
                tap: 'clearLogin'
            },
            'button[action=doLogin]': {
                tap: 'doLogin'
            },
            'loginView': {
                activated: 'onActivated'
            },
            'checkboxfield[action=onExpert]': {
                check: 'onExpertOn',
                uncheck: 'onExpertOff'
            }
        }
    },
    clearLogin: function() {
        Ext.getCmp('loginServerHost').setValue('');
        Ext.getCmp('loginServerPort').setValue('');
        Ext.getCmp('loginUsername').setValue('');
        Ext.getCmp('loginPassword').setValue('');
    },
    doLogin: function() {
        //var storeObject =  Ext.getStore('SettingsStore').getAt(0);

        var currView = Ext.getCmp('loginView');

        var serverHost = Ext.getCmp('loginServerHost').getValue();
        var serverPort = Ext.getCmp('loginServerPort').getValue();

        var username = Ext.getCmp('loginUsername').getValue();
        var password = Ext.getCmp('loginPassword').getValue();

        var savePassword = Ext.getCmp('loginSavePassword').getChecked();

        jsonLogin(currView, serverHost, serverPort, username, password, savePassword);
    },
    onExpertOn: function (){
        Ext.getCmp('loginServerHost').setHidden(false);
        Ext.getCmp('loginServerPort').setHidden(false);
    },
    onExpertOff: function (){
        Ext.getCmp('loginServerPort').setHidden(true);
    },
    onActivated: function (){
        //console.log('Login onActivated');

        var settingObject =  Ext.getStore('SettingsStore').getAt(0);
        if (settingObject != undefined)
        {
            Ext.getCmp('loginServerHost').setValue(settingObject.data.serverHost);
            Ext.getCmp('loginServerPort').setValue(settingObject.data.serverPort);
            Ext.getCmp('loginUsername').setValue(settingObject.data.serverUsername);

            Ext.getCmp('loginPassword').setValue(settingObject.data.serverPassword);

            if ((settingObject.data.serverPassword != undefined) && (settingObject.data.serverPassword.length > 0))
            {
                Ext.getCmp('loginSavePassword').setChecked(true);
            }
            else
            {
                Ext.getCmp('loginSavePassword').setChecked(false);
            }
        }

        var queryVariable = getURLVar('isLocal');
        if (queryVariable == 'true')
        {
            Ext.getCmp('loginServerHost').setValue(getHost());

            Ext.getCmp('loginServerHost').setHidden(true);
            Ext.getCmp('loginAdvanced').setHidden(true);
        }
    }

});

