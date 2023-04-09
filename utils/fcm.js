const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://quakemeter-16c75-default-rtdb.asia-southeast1.firebasedatabase.app',
});

async function sendMessage() {
//   console.log("message: emergency");
  // Fetch the tokens from an external datastore (e.g. database)
  const tokens = [process.env.TOKEN];
  const message = {
    tokens, // ['token_1', 'token_2', ...]
    data: { type: 'emergency' },
  };
  // Send a message to devices with the registered tokens
  await admin.messaging().sendMulticast(message);
}

// Send messages to our users
module.exports = sendMessage;
