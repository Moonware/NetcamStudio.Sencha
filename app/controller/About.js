Ext.define('netcam.controller.About', {
    extend: 'Ext.app.Controller',           
    requires: [
    	'Ext.MessageBox',
    	'Ext.device.Notification'
    ],
    config: {
        views: ['About'],
        control: {
            'button[action=facebook]': {
                tap: 'facebook'
            },
            'button[action=logout]': {
                tap: 'logout'
            }
        }
    },
    logout: function() {
        Ext.Msg.confirm("Confirm logout", "Do you want to logout ?", showResult );
    },
    facebook: function() {
        window.open('http://www.facebook.com','_blank');
    }
});

function showResult(btn){
    if (btn == "yes")
    {
        window.location.href = window.location.href;
    }

    /*Ext.Msg.alert("Button Click", "You clicked on " + btn, Ext.emptyFn);*/
}

