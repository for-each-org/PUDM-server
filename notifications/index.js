const admin = require('firebase-admin');

const handler = require('./notification-handler')();

var serviceAccount = require('../pudm-server-firebase-adminsdk-fwyrb-8e3d993449.json');

const INTERVAL = 30 * 1000; // Interval to check for unsent notifications in ms

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pudm-server.firebaseio.com'
});

var notificationsRef = admin.database().ref('notifications');

notificationsRef.on('child_added', (childSnapshot) => {
    let notif = flatten(childSnapshot.key, childSnapshot.val());
    handler.addNotifcation(notif);
});

notificationsRef.on('child_changed', (childSnapshot) => {
    let notif = flatten(childSnapshot.key, childSnapshot.val());
    handler.updateNotifcation(notif);
});

notificationsRef.on('child_removed', (oldChildSnapshot) => {
    let notif = flatten(oldChildSnapshot.key, oldChildSnapshot.val());
    handler.deleteNotification(notif);
});

setInterval(() => {
    // TODO: Create a notification for each device in each group
    while (handler.canSend()) {
        const notif = handler.getNotification();
        console.log('sent! scheduled: ', notif.time, ' actual: ', Math.round(new Date().getTime() / 1000));
        
        notificationsRef.child(notif.id).update({status : 1});
    }
}, INTERVAL);

function flatten(keyValue, object) {
    object.id = keyValue;
    return object;
}