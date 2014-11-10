/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'netcam',

    requires: [
        'Ext.MessageBox'
    ],

    stores: ['CamerasStore', 'ItemsStore', 'SettingsStore', 'ServersStore', 'ConnectedUsersStore', 'EventLogsStore'],
    models: ['CamerasModel', 'ItemsModel', 'SettingsModel', 'ServersModel', 'ConnectedUsersModel', 'EventLogsModel'],
    controllers: ['Login', 'Main', 'CameraView', 'CamerasList', 'ItemView', 'About'],
    views: ['Login', 'Main', 'CamerasList', 'CameraView', 'ItemsList', 'ItemView', 'ConnectedUsersList', 'EventLogsList', 'About'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        // Ext.Viewport.add(Ext.create('netcam.view.Main'));

        initialize();

        // Initialize the login view
        Ext.Viewport.add(Ext.create('netcam.view.Login'));

        <!-- Unless using the CDN hosted version, update the URL to the Flash SWF -->
        <!-- <videojs.options.flash.swf = "resources/videojs/video-js.swf"; -->

        soundManager.setup({
            url: 'resources/soundmanager/swf/',
            flashVersion: 9,
            // optional: 9 for shiny features (default = 8)
            // optional: ignore Flash where possible, use 100% HTML5 mode
            // preferFlash: false,
            useHighPerformance: true,
            useFastPolling: true,
            autoLoad: true,
            onready: function() {
                // Ready to use; soundManager.createSound() etc. can now be called.
            }
        });

    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
