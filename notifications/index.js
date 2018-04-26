const admin = require('firebase-admin');

const handler = require('./notification-handler')();

var serviceAccount = require('../pudm-server-firebase-adminsdk-fwyrb-8e3d993449.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pudm-server.firebaseio.com'
});


var notificationsRef = admin.database().ref('notificaitons');

notificationsRef.once('value', (dataSnapshot) => {
  console.log(snapshot.toJSON());
});

notificationsRef.on('child_added', (childSnapshot) => {

});

notificationsRef.on('child_changed', (childSnapshot) => {

});

notificationsRef.on('child_moved', (childSnapshot) => {

});

notificationsRef.on('child_removed', (oldChildSnapshot) => {
  var notif = flatten('id', oldChildSnapshot.key, oldChildSnapshot.val());
  handler.deleteNotification(notif);
});

var timeout = setInterval(() => {
  // TODO: check to see if there's notifications to send, then send them
}, 60000);
































function flatten(keyName, keyValue, object) {
  object[keyName] = keyValue;
  return object;
}
