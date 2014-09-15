Ext.define('netcam.controller.CamerasList', {
    extend: 'Ext.app.Controller',
    requires: [
    	'Ext.MessageBox',
    	'Ext.device.Notification'
    ],
    config: {
        views: ['CamerasList'],
        refs: {
            camerasList: '#camerasListView'
        },
        control: {
            'camerasList': {
                /*
                viewActivate: 'onViewActivate',
                viewDeactivate: 'onViewDeactivate'
                 */

            }
        }
    }
    /*
    ,
    onViewActivate: function()
    {

    },
    onViewDeactivate: function()
    {

    }
    */

});



