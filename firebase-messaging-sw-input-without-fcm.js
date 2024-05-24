



/**
 * Config Variables
 */

// const { senderId } = Resu_sdk_manifest.pushConfig;

/**
 * APIs listing
 */

const campaignTracking = "/webCampaignTracking";

const Custom_Events = "/CustomEvents";

const User_Journey = "/UserJourney";

const User_Register = "/UserRegister";

/**
 * BaseURL Listing
 */

const RUN_Baseurl = 'https://sdk.resu.io/Campaign';

const BIZ_Baseurl = 'https://b.resu.io/Campaign';

const Team_Baseurl = 'https://l.resu.io/Campaign';

const environment = "RUN";

/**
 * Method for BaseUrl
 */

const getBaseUrl = (apiMethod) => {

    let Baseurl = '';

    switch (environment) {

        case "RUN":
            Baseurl = RUN_Baseurl
            break;
        case "BIZ":
            Baseurl = BIZ_Baseurl
            break;
        case "TEAM":
            Baseurl = Team_Baseurl
            break;
        default:
            Baseurl = RUN_Baseurl
            break;

    }

    ////console.log(`Environment: ${environment}, BaseUrl: ${Baseurl}`);
    return Baseurl + apiMethod;
}


var dataToRepresent = {}, representNotificationData = {};
var definedRules = [];
var rulesMethod = {};

const respondToServer = function (_payload, id) {
    id = msgId;
    var retryCount = 0;
    Promise.all([getIDB('Res_Passport_Id'), getIDB('Res_Profile_Id'), getIDB('_tenantId')]).then(res => {
        let payload = {
            ..._payload,
            id: notification_id || id,
            passportId: res[0] || '',
            profileID: res[1] || '',
            tenantId: res[2] || '',
            domainName: self.registration.scope,
            // deviceId: clientInfo.deviceId,
            status: _payload.status_code
        }
        let option = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }
        //console.log(option, id);
        const data = getBaseUrl(campaignTracking);
        const postData = (data, option) => fetch(data, option).then(res => res.json()).then(res => { //console.log(res) },err=> {
            // //console.log('err on posting... retrying...: '+retryCount+' ' ,err);
            if(retryCount < 5){
                setTimeout(() => { 
                    postData(data, option);
                    retryCount++;
                }, 1500);
            } else {
                // //console.log('retrying stopped')
            }
        });
        postData(data, option);
        // fetch("https://sdklb13.resu.io/Campaign/customeventstest", option).then(res => res.json()).then(res => {/*//console.log(res)*/ });
    });
};

var actions = '', clientInfo = null, button_actions = [],
    showInAppNotification = "false", notification_id = null, pass_id = '';
var fcm_senderId = '';
var msgId = null;
var queuedmsg = [], db, passTimer = null;


function addIDB(key, value) {
    return new Promise(function (resolve, reject) {
        try {
            let openRequest = indexedDB.open("resuldata", 1);
            openRequest.onsuccess = function () {
                try {
                    db = openRequest.result;
                    try {
                        if (!db.objectStoreNames.contains('Res_Data')) {
                            db.createObjectStore('Res_Data', { keyPath: 'key' });
                        }
                    } catch (e) { }
                    //console.log('openRequest db', openRequest, db);
                    let dbTransaction = db.transaction(["Res_Data"], "readwrite");
                    var request = dbTransaction.objectStore("Res_Data").put({ key: btoa(key), value: btoa(btoa(JSON.stringify(value))) });
                    request.onsuccess = function (event) {
                        resolve("Added to database.");
                    };
                    request.onerror = function (event) {
                        reject('error: ' + event);
                    }
                } catch (error) {
                    //console.log('addIDB err:', error);
                }
            };
        } catch (error) {
            //console.log('addIDB err:', error);
        }
    })
}

function getIDB(key) {
    //console.log('getIDB', key);
    return new Promise(function (resolve, reject) {
        try {
            let openRequest = indexedDB.open("resuldata", 1);
            openRequest.onsuccess = function () {
                try {
                    db = openRequest.result;
                    try {
                        if (!db.objectStoreNames.contains('Res_Data')) {
                            db.createObjectStore('Res_Data', { keyPath: 'key' });
                        }
                    } catch (e) { }
                    //console.log('openRequest db', openRequest, db);
                    let dbTransaction = db.transaction(["Res_Data"]);
                    // var objectStore = dbTransaction.objectStore("Res_Data");

                    var objectStoreRequest = dbTransaction.objectStore("Res_Data").get(btoa(key));
                    objectStoreRequest.onsuccess = function (event) {
                        let res = objectStoreRequest.result.value;
                        try {
                            res = JSON.parse(atob(atob(res)));
                            resolve(res);
                        } catch (err) {
                            reject(err);
                        }
                    }
                    objectStoreRequest.onerror = function (err) {
                        reject(err);
                    }
                } catch (error) {
                    reject(error);
                }
            };
        } catch (error) {
            reject(error);
        }
    });
}
var _client = null;
addEventListener('fetch', event => {
    event.waitUntil(function () {
        if (!event.clientId) {
            return;
        };
        clients.get(event.clientId).then(client => {
            if (!client) {
                return;
            }
            _client = client;
            if (showInAppNotification == "true") {
                //console.log('showInAppNotification == "true"');
                //console.log('representNotificationData', representNotificationData);
                client.postMessage({
                    msg: representNotificationData
                });
                self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
                    if (clients && clients.length) {
                        clients[0].postMessage({ msg: representNotificationData });
                    }
                });
            }
            if (!!pass_id) {
                //console.log('pass_id: ', pass_id);
                client.postMessage({ pass_id: pass_id });
            }
        })

    }());
});

self.addEventListener('install', function (event) {
    self.skipWaiting();
});
self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});


self.addEventListener('message', data => {
    let mainWindow = null;
    try {
        self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
            //console.log('event message', data, clients);
            mainWindow = clients;
            //console.log('event message mainWindow', mainWindow);

        })
    } catch (error) {

    }
    if ('event' in data.data) {
        if ("ping" == data.data.event) {
            try {

                self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
                    if (clients && clients.length) {
                        clients[0].postMessage({ ping: "success" });
                    }
                });
            } catch (error) {

            }
        }
        if ("customEventTest" == data.data.event) {
            const option = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.data.payload || data.data.data)
            }
            //console.log('customEventTest triggred');
            fetch("https://sdklb13.resu.io/Campaign/customeventstest", option).then(res => res.json()).then(res => {/*//console.log(res)*/ });
        }
        if ("resu_post" == data.data.event) {
            const option = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.data.data.payload)
            }
            //console.log('resu_post triggred');
            fetch(data.data.data.url, option).then(res => res.json()).then(res => {/*//console.log(res)*/ });
        }
        if ("customEvent" == data.data.event) {
            //console.log('Custome event triggred', data.data);
            Promise.all([getIDB('Res_Passport_Id'), getIDB('Res_Profile_Id'), getIDB('_tenantId'), getIDB('deviceId')]).then(res => {
                try {
                    const payload = {
                        ...data.data.payload,
                        passportId: res[0] || '',
                        profileID: res[1] || '',
                        tenantId: res[2] || '',
                        deviceId: res[3] || ''
                    }
                    const option = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }
                    fetch(getBaseUrl(Custom_Events), option).then(res => res.json()).then(res => {/*//console.log(res)*/ });
                } catch (error) { }
            })
        } else if ("userRegisterEvent" == data.data.event) {
            const option = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.data.payload)
            }
            //console.log('userRegisterEvent triggred', JSON.stringify(data.data.payload));
            fetch(getBaseUrl(User_Register), option).then(res => res.json()).then(res => {
                //console.log('pass_id', res);
                if (res.data != 'success' && !!res.data) {
                    pass_id = res.data
                    passTimer = setInterval(() => {
                        try {
                            self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
                                if (clients && clients.length) {
                                    clients[0].postMessage({ pass_id: pass_id });
                                    //console.log('posted to client');
                                }
                            });
                        } catch (error) {

                        }
                    }, 2000);
                    setTimeout(() => {
                        clearInterval(passTimer)
                    }, 20000);
                }
            });
        }
        else if ("userJourney" == data.data.event) {
            const option = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.data.payload)
            }
            //console.log('userJourney triggred', data.data);
            fetch(getBaseUrl(User_Journey), option).then(res => res.json()).then(res => {/*//console.log(res)*/ });
        }
        else if ('customMsgEvent' == data.data.event) {
            dataToRepresent = data;
            clientInfo = data.data;
            //console.log("dataToRepresent", dataToRepresent);
            // if("inAppNotification" in data.data.data){
            //console.log(data.data.data);
            // if (notification_id != data.data.data["id"]) {
            notification_id = data.data.data["id"];
            //console.log(notification_id);
            representNotification(dataToRepresent);
            // } else {
            //     //console.log('notification already presented');
            // }
        } else if (data.data.event == "dismissInapp") {
            console.log('dismissInapp tapped');
            showInAppNotification = "false";
            representNotificationData = {};
        } else if (data.data.event == "notificationqueue") {
            console.log('notificationqueue', data.data.payload.data);
            showBgNotification(data.data.payload);
        } else if (data.data.event == "checkSession") {
            self.registration.showNotification('session closed!');
        } else if (data.data.event == "clear_pass_id") {
            pass_id = '';
            clearInterval(passTimer)
        } else if (data.data.event == "dismiss_TBN") {
            //console.log('received event');
            //console.log('mainWindow', mainWindow);
            //console.log('mClients', self.clients);
            
            // const channel = new BroadcastChannel('sw-messages');
            // channel.postMessage({ title: 'Hello from SW' });
            self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
                //console.log('iClients', clients)
                if (clients && clients.length) {
                    clients[0].postMessage({ event: 'dismiss_TBN_tapped' });
                    mainWindow[0].postMessage({ event: 'dismiss_TBN_tapped' });
                }
            });
        }
    }
});

var dataforlater = null;
