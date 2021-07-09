const serviceAccount = require('./private/private.json');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const db = admin.firestore();
const docRef = db.collection('temp').add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
}).then(s => console.log(s))