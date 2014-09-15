// Common Methods
var deviceUID = 'Default';

function initialize()
{
    //alert('initialize');

    console.log('Loading ServerStore...');
    // Init list of servers
    var serverStore = Ext.getStore('ServersStore');
    try
    {
        serverStore.load();
    }
    catch (err)
    {
        console.log("Error Loading Servers from Store: " + err);
    }

    if (serverStore.getAt(0) == undefined)
    {
        // Put a default server
        serverStore.removeAll();

        var server1 = new netcam.model.ServersModel();
        server1.data.serverId = 1;
        server1.data.serverHost = '';
        server1.serverUsername = '';
        server1.serverPassword = '';
        server1.data.serverPort = 8100;
        server1.data.serverTitle = 'Test Server';
        server1.data.serverHeaderImage = 'default.png';
        serverStore.add(server1);

        serverStore.sync();

        console.log('Server List is not existing. Using and saving defaults (' + server1.data.serverHost + ')!');
    }
    else
    {
        console.log('Server List Found! (' + serverStore.getCount() + ' entries )');
    }


    console.log('Loading SettingsStore...');

    // Load / Init User Settings
    var settingsStore = Ext.getStore('SettingsStore');
    var settingObject = undefined;

    try
    {
        settingsStore.load();
        settingObject =  settingsStore.getAt(0);
    }
    catch (err)
    {
        console.log("Error Loading Settings from Store: " + err);
    }

    if ((settingObject != undefined) && (settingObject.data != undefined))
    {
        $.each(settingObject.data, function(index, value) {
            console.log('settingObject [' + index + '] : ' + value);
        });
    }
    else
    {
        settingsStore.removeAll();

        settingObject = new netcam.model.SettingsModel();

        settingObject.data.serverId = 1;
        settingObject.data.serverHost = serverStore.getAt(0).data.serverHost;
        settingObject.data.serverPort = serverStore.getAt(0).data.serverPort;

        settingObject.data.serverUsername = '';
        settingObject.data.serverPassword = '';
        settingObject.data.sessionToken = '';
        settingObject.data.sessionTokenTimestamp = '';

        settingsStore.add(settingObject);
        settingsStore.sync();

        console.log('Settings are not existing. Using and saving defaults (' + settingObject.data.serverHost + ')!');
    }

    try
    {
        console.log('Loading CamerasStore...');

        Ext.getStore('CamerasStore').load();
        Ext.getStore('CamerasStore').removeAll();
        Ext.getStore('CamerasStore').sync();

        console.log('Loading ItemsStore...');

        Ext.getStore('ItemsStore').load();
        Ext.getStore('ItemsStore').removeAll();
        Ext.getStore('ItemsStore').sync();

        console.log('Loading ConnectedUsersStore...');

        Ext.getStore('ConnectedUsersStore').load();
        Ext.getStore('ConnectedUsersStore').removeAll();
        Ext.getStore('ConnectedUsersStore').sync();

        console.log('Loading EventLogsStore...');

        Ext.getStore('EventLogsStore').load();
        Ext.getStore('EventLogsStore').removeAll();
        Ext.getStore('EventLogsStore').sync();
    }
    catch (err)
    {
        console.log("Error reseting the Stores: " + err);
    }

    //console.log('initialize() completed...');
}

function hasConnection()
{
    if ((navigator == undefined) || (navigator.network == undefined))
    {
        return true;
    }
    else
    {
        var networkState = navigator.network.connection.type;
        return networkState != Connection.NONE && networkState != Connection.UNKNOWN;
    }
}

function saveSettings(receivedSetting)
{
    settingsStore = Ext.getStore('SettingsStore');

    var newSetting = new netcam.model.SettingsModel();

    newSetting.data.serverId = receivedSetting.data.serverId;
    newSetting.data.serverHost = receivedSetting.data.serverHost;
    newSetting.data.serverPort = receivedSetting.data.serverPort;
    newSetting.data.serverUsername = receivedSetting.data.serverUsername;
    newSetting.data.serverPassword = receivedSetting.data.serverPassword;
    newSetting.data.sessionToken = receivedSetting.data.sessionToken;
    newSetting.data.sessionTokenTimestamp = receivedSetting.data.sessionTokenTimestamp;

    settingsStore.removeAll();
    settingsStore.add(newSetting);
    settingsStore.sync();
}

function base64_encode (data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}


function getURLVar(urlVarName) {
    var urlHalves = String(document.location).split('?');
    var urlVarValue = '';

    if(urlHalves[1])
        {var urlVars = urlHalves[1].split('&');for(i=0; i<=(urlVars.length); i++){if(urlVars[i]){var urlVarPair = urlVars[i].split('=');if (urlVarPair[0] && urlVarPair[0] == urlVarName) {urlVarValue = urlVarPair[1];}}}}

    return urlVarValue;
}

function getHost() {
    return document.location.hostname;
}

function getPort() {
    var urlHost = String(document.location.host).split(':');
    var urlPort = '80';

    if(urlHost[1])
        urlPort = urlHost[1];

    return urlPort;
}


var activeView = null;

// 0. Preview Control
var videoMode = 0;
var previewRunning = false;
var drawingBuffer = 0;
var previewResolution = 0;
var libraryItemsToDisplay = 50;
var librarySource = -1; // ALL

function setPreviewResolution(res)
{
    previewResolution = res;
    updatePreviewSize();
}

function updatePreviewSize()
{
    var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

    if (cObject != undefined)
    {
        var cItem = cObject.data;

        var srcWidth = cItem.Width;
        var srcHeight = cItem.Height;

        if (previewResolution == 1)
        {
            srcHeight = srcHeight * (200 / srcWidth);
            srcWidth = 200;
        }

        if (previewResolution == 2)
        {
            srcHeight = srcHeight * (320 / srcWidth);
            srcWidth = 320;
        }


        var sWidth = Ext.Viewport.getWidth();
        var sHeight = Ext.Viewport.getWidth();

        sWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        sHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;

        /*console.log('Client Size: ' + sWidth + 'x' + sHeight);*/

        while (srcWidth > (sWidth - 10))
        {
            srcWidth = srcWidth * 0.99;
            srcHeight = srcHeight * 0.99;
            /*console.log('Downscaling Preview Size...');*/
        }

        // Set Size of Preview / Video
        $( ".cameraImg").css("width", srcWidth);
        $( ".cameraImg").css("height", srcHeight);

        $( ".cameraVideo").css("width", srcWidth);
        $( ".cameraVideo").css("height", srcHeight);

        // LiveView Panel Resize
        $( "#cameraViewLivePanel").css("width", srcWidth + 2);
        $( "#cameraViewLivePanel").css("height", srcHeight + 2);

        // Center PTZ
        $( ".ptzLine").css("left", (srcWidth / 2) - 75);

        //$( "#cameraViewLivePanel").css("width", srcWidth + 6);
        //$( "#cameraViewLivePanel").css("height", srcHeight + 6);

    }
}

function stopPreview()
{
    previewRunning = false;

    var bufferImages = [ $( "#cameraImg1"),  $( "#cameraImg2")];

    bufferImages[1-drawingBuffer].css("visibility", "false");
    bufferImages[drawingBuffer].css("visibility", "false");

    bufferImages[1-drawingBuffer].css("background-image", "url('./resources/images/loading.jpg')");
    bufferImages[drawingBuffer].css("background-image", "url('./resources/images/loading.jpg')");

}

function startPreview()
{
    if (videoMode == 0)
    {
        previewRunning = true;
        setTimeout(refreshPreview, 50);
    }
}

function refreshPreview() {

    drawingBuffer=1-drawingBuffer;

    var bufferImages = [ $( "#cameraImg1"),  $( "#cameraImg2")];

    var sObject =  Ext.getStore('SettingsStore').getAt(0);
    var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

    if (cObject != undefined)
    {
        var cItem = cObject.data;

        var now = new Date();
        var ticks = now.getTime();
        var imagePath = cItem.SourceUrl + '&r=' + ticks;

        imagePath = imagePath.replace("{server}",  sObject.data.serverHost);
        imagePath = imagePath.replace("{port}",  sObject.data.serverPort);
        imagePath = imagePath.replace("{urlSuffix}",  'Jpeg');
        imagePath = imagePath.replace("{camId}",   cItem.Id);
        imagePath = imagePath.replace("{resolution}",   previewResolution);

        // Beware, here it's &authToken not ?authToken like all "standard" methods
        imagePath = imagePath + '&authToken=' + sObject.data.sessionToken;

        bufferImages[drawingBuffer].css("visibility", "visible");
        bufferImages[1-drawingBuffer].css("visibility", "hidden");

        bufferImages[1-drawingBuffer].attr("src", imagePath)
            .one('load', function() { //Set something to run when it finishes loading
                if (previewRunning)
                {
                    setTimeout(refreshPreview, 40);
                }
            })
            .each(function() {
                //Cache fix for browsers that don't trigger .load()
                if(this.complete) $(this).trigger('load');
            });
    }

}

function ptzControl(direction)
{
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);


        // username / password
        var queryParams = 'sourceId=' + cObject.data.Id + '&x=' + 0 + '&y=' + 0 + '&command=' + direction + '&authToken=' + currentSettings.data.sessionToken;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort  + '/Json' + '/SendPTZCommandJson?' + queryParams;


        console.log('SendPTZ >> ' + jsonCommand);

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    $.each(data, function(index, value) {
                        console.log('SendPTZ Response [' + index + '] : ' + value);
                    });
                }
            },
            error: function(err) {
                console.log('SendPTZ Failed: ' + err);
            },
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }

        });

    } catch (err) {
        console.log('SendPTZ Exception: ' + err);
    }
}

// 1. Login Method
function jsonLogin(currentView, serverHost, serverPort, username, password, savePassword) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    console.log('jsonLogin > ' + serverHost + ', ' + serverPort + ', ' + savePassword )
    
    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // username / password
        var queryParams = 'username=' + username + '&password=' + password;
        var jsonCommand = 'http://' + serverHost + ':' + serverPort + '/Json' + '/Login?' + queryParams;

        console.log('Login >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Login...', docked: 'top' });
        }

        currentSettings.data.serverHost = serverHost;
        currentSettings.data.serverPort = serverPort;
        currentSettings.data.serverUsername = username;

        saveSettings(currentSettings);


        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    if (data.IsAuthenticated == true)
                    {
                        console.log('Session Token Received : ' + data.SessionToken);

                        if (savePassword)
                        {
                            currentSettings.data.serverPassword = password;
                        }
                        else
                        {
                            console.log('Password not saved >> ' + savePassword)
                            currentSettings.data.serverPassword = '';
                        }

                        currentSettings.data.sessionToken = data.SessionToken;
                        currentSettings.data.sessionTokenTimestamp = new Date();

                        saveSettings(currentSettings);

                        // Init all screens.
                        //jsonGetCameras(currentView);
                        //jsonGetLastItems(currentView, -1, 50);
                        //jsonConnectedUsers(currentView);
                        //jsonGetEventLogs(currentView, 50);

                        var mainPanel = Ext.getCmp('mainPanel');

                        if (mainPanel == undefined)
                        {
                            console.log('Creating instance of MainPanel');
                            mainPanel = new netcam.view.Main();
                            Ext.Viewport.add(mainPanel);
                        }

                        Ext.Viewport.animateActiveItem(mainPanel, {type:'slide', direction:'left'});
                    }
                    else
                    {
                        var errorMsg = data.FailedLoginMessage;
                        Ext.Msg.alert('Login Failed', 'Reason: ' + errorMsg, Ext.emptyFn);
                    }
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }

            },
            error: function(err) {
                console.log('Login Failed: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }

                $.each(err, function(index, value) {
                    console.log('Login Response [' + index + '] : ' + value);
                });

                var errMsg = '';
                if (err.status == 0)
                {
                    errMsg = 'Cannot connect to server';
                }
                else
                {
                    errMsg = 'Error ' + err.status + ' - ' + err.statusText;
                }

                Ext.Msg.alert('Login Failed', errMsg, Ext.emptyFn);

            },
            beforeSend: function(xhr) {
                /*
                xhr.setRequestHeader("QueryString", queryParams);
                */
            }

        });

    } catch (err) {
        console.log('Login Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }
    }
}

// 2. Get Cameras Method
var currentCameraIndex = 0;

function jsonGetCameras(currentView) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // username / password
        var queryParams = 'authToken=' + currentSettings.data.sessionToken;

        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/GetCameras?' + queryParams;

        console.log('Get Cameras >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Retrieving Cameras List...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    var cameraStore = Ext.getStore('CamerasStore');

                    cameraStore.removeAll();

                    cameraStore.add(data);

                    cameraStore.sync();

                    if (cameraStore.getCount() < currentCameraIndex)
                    {
                        currentCameraIndex = 0;
                    }

                    if (cameraStore.getCount() == 0)
                    {
                        Ext.Msg.alert("Information", "Your session has timed out. Please login again.", function(btn, act){ window.location.href = window.location.href;});
                    }

                    var cObject =  Ext.getStore('CamerasStore').getAt(currentCameraIndex);

                    // Update the camera view for the selected item.
                    if (Ext.getCmp('cameraViewRecord') != undefined)
                    {
                        if (cObject.data.Status.IsRecording)
                        {
                            Ext.getCmp('cameraViewRecord').setUi('decline');
                        }
                        else
                        {
                            Ext.getCmp('cameraViewRecord').setUi('plain');
                        }
                    }

                    if (Ext.getCmp('cameraViewMotion') != undefined)
                    {
                        /*
                        if (cObject.data.Status.IsMotionDetector)
                        {
                            Ext.getCmp('cameraViewMotion').setChecked(true);
                        }
                        else
                        {
                            Ext.getCmp('cameraViewMotion').setChecked(false);
                        }
                        */

                        if (cObject.data.Status.IsMotionDetector)
                        {
                            Ext.getCmp('cameraViewMotion').setUi('action');
                        }
                        else
                        {
                            Ext.getCmp('cameraViewMotion').setUi('plain');
                        }
                    }

                    applyCamerasCss();
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('GetCameras Failed: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            }
            /*,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("QueryString", queryParams);
            }
            */

        });

    } catch (err) {
        console.log('GetCameras Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }
    }
}


// 3. Get Last Items Method
var currentItemIndex = 0;

// used by setTimeout without params
function refreshLibrary()
{
    // This refreshes the list of Cameras (+ Status)
    jsonGetCameras(null);

    // We also refresh the library
    jsonGetLastItems(null, librarySource, libraryItemsToDisplay);
}

function jsonGetLastItems(currentView, sourceId, nbRecords) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // username / password
        var queryParams = 'sourceId=' +  sourceId + '&numRecords=' + nbRecords + '&authToken=' + currentSettings.data.sessionToken;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/GetLastItems?' + queryParams;

        console.log('Get LastItems >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Retrieving Last Items...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    var itemStore = Ext.getStore('ItemsStore');

                    itemStore.removeAll();

                    itemStore.add(data);

                    itemStore.sync();

                    var numItems = itemStore.getCount();
                    console.log('Number of Items: ' + numItems);

                    mPanel = Ext.getCmp('mainPanel');
                    if (mPanel != undefined)
                    {
                        mPanel.getTabBar().getComponent(1).setBadgeText(numItems);
                    }

                    currentItemIndex = 0;

                    applyItemsCss();
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('GetLastItems Failed: ' + err);

                //$.each(err, function(index, value) {
                //    console.log('GetLastItems Error [' + index + '] : ' + value);
                //});

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }

                if  ((err != undefined) && (err.status == 400))
                {
                    // Login Out in case of bad requezt
                    window.location.href = window.location.href;
                }
            }
            /*,
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }
            */

        });

    } catch (err) {
        console.log('GetLastItems Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }
    }
}


// 4. Get Connected Users
var currentUserIndex = 0;

function jsonGetConnectedUsers(currentView) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // username / password
        var queryParams = 'authToken=' + currentSettings.data.sessionToken;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/GetConnectedUsers?' + queryParams;

        console.log('Get Connected Users >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Retrieving Connected Users...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    var userStore = Ext.getStore('ConnectedUsersStore');

                    userStore.removeAll();

                    userStore.add(data);

                    userStore.sync();

                    var numUsers = userStore.getCount();
                    console.log('Number of Users: ' + numUsers);

                    mPanel = Ext.getCmp('mainPanel');
                    if (mPanel != undefined)
                    {
                        mPanel.getTabBar().getComponent(2).setBadgeText(numUsers);
                    }
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('GetConnectedUsers Failed: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }

        });

    } catch (err) {
        console.log('GetConnectedUsers Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }

        if  ((err != undefined) && (err.status == 400))
        {
            // Login Out in case of bad requezt
            window.location.href = window.location.href;
        }
    }
}


// 5. Get Event Logs
var currentLogIndex = 0;

function jsonGetEventLogs(currentView, nbRecords) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // username / password
        var queryParams = 'numRecords=' + nbRecords + '&authToken=' + currentSettings.data.sessionToken;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/GetEventLogs?' + queryParams;

        console.log('Get Event Logs >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Retrieving Last Items...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    var logStore = Ext.getStore('EventLogsStore');

                    logStore.removeAll();

                    logStore.add(data);

                    logStore.sync();

                    currentLogIndex = 0;
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('GetEventLogs Failed: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }

        });

    } catch (err) {
        console.log('GetEventLogs Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }

        if  ((err != undefined) && (err.status == 400))
        {
            // Login Out in case of bad requezt
            window.location.href = window.location.href;
        }
    }
}

// 6. Capture Picture
function jsonCapturePicture(currentView, sourceId) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // sourceId, filename
        var queryParams = 'sourceId=' + sourceId + '&fileName=' + '' + '&authToken=' + currentSettings.data.sessionToken;;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/CapturePicture?' + queryParams;

        console.log('Capture Picture >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Capturing...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    // Refresh the library 250ms later
                    setTimeout(refreshLibrary, 250);
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('CapturePicture: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }

        });

    } catch (err) {
        console.log('CapturePicture Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }
    }
}

// 6. Start Stop Recording
function jsonStartStopRecording(currentView, sourceId, enabled) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // sourceId, enabled
        var queryParams = 'sourceId=' + sourceId + '&enabled=' + enabled + '&authToken=' + currentSettings.data.sessionToken;;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/StartStopRecording?' + queryParams;

        console.log('Start / Stop Recording >> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Recording...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    // Refresh the library 250ms later
                    setTimeout(refreshLibrary, 250);
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('StartStopRecording: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }

        });

    } catch (err) {
        console.log('StartStopRecording Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }
    }
}

// 7. Start Stop Motion
function jsonStartStopMotionDetector(currentView, sourceId, enabled) {
    if (!hasConnection())
    {
        Ext.Msg.alert('Information', 'Your device is not connected to internet!', Ext.emptyFn);
        return;
    }

    try {
        var currentSettings =  Ext.getStore('SettingsStore').getAt(0);

        // sourceId, enabled
        var queryParams = 'sourceId=' + sourceId + '&enabled=' + enabled + '&authToken=' + currentSettings.data.sessionToken;;
        var jsonCommand = 'http://' + currentSettings.data.serverHost + ':' + currentSettings.data.serverPort + '/Json' + '/StartStopMotionDetector?' + queryParams;

        console.log('Start / Stop Motion Detector>> ' + jsonCommand);

        if (currentView != undefined)
        {
            currentView.setMasked({ xtype: 'loadmask', message: 'Motion Detector...', docked: 'top' });
        }

        $.ajax({
            url: jsonCommand,
            type: 'GET',
            datatype: 'json',
            success: function(data) {

                if (data != undefined)
                {
                    // Refresh the library 250ms later
                    setTimeout(refreshLibrary, 250);
                }

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            error: function(err) {
                console.log('StartStopMotionDetector: ' + err);

                if (currentView != undefined)
                {
                    currentView.setMasked(false);
                }
            },
            beforeSend: function(xhr) {
                //xhr.setRequestHeader("QueryString", queryParams);
            }

        });

    } catch (err) {
        console.log('StartStopMotionDetector Exception: ' + err);

        if (currentView != undefined)
        {
            currentView.setMasked(false);
        }
    }
}


/* Helpers */

function jsonDateToStr(jsonDate){
    return moment(parseJsonDate(jsonDate)).format("D.MM.YYYY H:mm:ss");
}

function dateToStr(jsonDate){
    return moment(new Date(jsonDate)).format("D.MM.YYYY H:mm:ss");
}

function formatSpeed(transferredBytes){
    return parseFloat(transferredBytes / 1024).toFixed(2) + ' kb/s';
}

function parseJsonDate(jsonDate) {
    if (jsonDate != undefined) {
        //alert(jsonDate);
        //var offset = new Date().getTimezoneOffset() * 60000;
        var offset = 0;

        try
        {
            var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDate);
            if (parts[2] == undefined) parts[2] = 0;
            if (parts[3] == undefined) parts[3] = 0;
            return new Date(+parts[1] + offset + parts[2]*3600000 + parts[3]*60000);
        }
        catch(err)
        {
            alert('parseJsonDate failed [' + jsonDate + '] > ' + err);
        }
    }
}

function itemTypeIdToStr(itemId)
{
    var retStr = 'Unknown';

    if (itemId == 1)
    {
        retStr = 'Capture';
    } else if (itemId == 2)
    {
        retStr = 'Recording';
    } else if (itemId == 3)
    {
        retStr = 'Timelapse';
    } else if (itemId == 4)
    {
        retStr = 'Dvr';
    } else if (itemId == 5)
    {
        retStr = 'Motion';
    }

    return retStr;
}

function criticalityToString(critId)
{
    var retStr = 'Debug';

    if (critId == 1)
    {
        retStr = 'Information';
    } else if (critId == 2)
    {
        retStr = 'Warning';
    } else if (critId == 3)
    {
        retStr = 'Error';
    } else if (critId == 4)
    {
        retStr = 'Critical';
    }

    return retStr;
}


function applyCamerasCss()
{
    /*console.log('applyCameraCss()');*/
                                 
    try {

        var sObject =  Ext.getStore('SettingsStore').getAt(0);

        Ext.getStore('CamerasStore').each(function(rec){

            var itemId =  rec.get('Id')
            if(itemId != undefined){

                var now = new Date();
                var ticks = now.getTime();
                var previewUrl = rec.get('SourceUrl') + '&r=' + ticks;

                previewUrl = previewUrl.replace("{server}",  sObject.data.serverHost);
                previewUrl = previewUrl.replace("{port}",  sObject.data.serverPort);
                previewUrl = previewUrl.replace("{urlSuffix}",  'Jpeg');
                previewUrl = previewUrl.replace("{camId}",   itemId);
                previewUrl = previewUrl.replace("{resolution}",  1);

                // Beware, here it's &authToken not ?authToken like all "standard" methods
                previewUrl = previewUrl + '&authToken=' + sObject.data.sessionToken;

                //var previewUrl = 'http://' + sObject.data.serverHost + ':' + sObject.data.serverPort + '/Jpeg/' + itemId + '?authToken=' + sObject.data.sessionToken;

                // Only if background:none
                var currentCss = $( ".cameraPreview.t" + itemId).css("background-image");
                if (currentCss == 'none')
                {
                    $( ".cameraPreview.t" + itemId).css("background-image", "url('" + previewUrl + "')");

                    var cHeight = 80;
                    var cObject =  Ext.getStore('CamerasStore').getAt(itemId);
                    if (cObject != undefined)
                    {
                        var srcWidth = cObject.data.Width;
                        var srcHeight = cObject.data.Height;
                        if (srcWidth > 0)
                        {
                            cHeight = srcHeight * (120 / srcWidth);
                        }
                    }

                    $( ".cameraPreview.t" + itemId).css("height", cHeight + "px");

                    console.log('.cameraPreview.t' + itemId + ' (' + itemId + ') > ' + previewUrl);
                }
            }
        });

    } catch (err) {
        console.log('ListCamera.ApplyCSS Error: ' + err);
    }
}

function applyItemsCss()
{
    /*console.log('applyItemsCss()');*/
                                 
    try {

        var sObject =  Ext.getStore('SettingsStore').getAt(0);

        Ext.getStore('ItemsStore').each(function(rec){

            var itemId =  rec.get('Id')
            var sourceId =  rec.get('SourceId')

            if(itemId != undefined){

                var previewUrl = 'http://' + sObject.data.serverHost + ':' + sObject.data.serverPort + '/Library/Thumb/' + itemId + '?authToken=' + sObject.data.sessionToken;

                // Only if background:none
                var currentCss = $( ".itemPreview.t" + itemId).css("background-image");
                if (currentCss == 'none')
                {
                    $( ".itemPreview.t" + itemId).css("background-image", "url('" + previewUrl + "')");

                    var cHeight = 80;
                    var cObject =  Ext.getStore('CamerasStore').getAt(sourceId);
                    if (cObject != undefined)
                    {
                        var srcWidth = cObject.data.Width;
                        var srcHeight = cObject.data.Height;
                        if (srcWidth > 0)
                        {
                            cHeight = srcHeight * (120 / srcWidth);
                        }
                    }

                    $( ".itemPreview.t" + itemId).css("height", cHeight + "px");

                    console.log('.itemPreview.t' + itemId + ' (' + sourceId + ') > ' + previewUrl);
                }
            }
        });

    } catch (err) {
        console.log('ListItem.ApplyCSS Error: ' + err);
    }
}


function getUserIcon(iconName)
{
    var fullUrl =  'resources/images/UserIcons/' + iconName;

    return fullUrl;
}