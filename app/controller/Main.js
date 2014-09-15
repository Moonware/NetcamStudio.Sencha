Ext.define('netcam.controller.Main', {
    extend: 'Ext.app.Controller',           
    requires: [
    	'Ext.MessageBox',
    	'Ext.device.Notification'
    ],
    config: {
        views: ['Main'],
        refs: {
            mainPanel: '#mainPanel'
        },
        control: {
            'mainPanel': {
                showLogin: 'showLogin',
                activated: 'onActivated'
            }
        }
    },
    showLogin: function() {

    },
    onActivated: function (){
        //console.log('Main View onActivated');

    }
});

