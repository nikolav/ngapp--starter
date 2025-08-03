// # ./firebase-messaging-sw.js
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBSg5aYqpL5OXfa-4j9BCQYZMhUIDlmXsE",
  authDomain: "ngapp---iec2cy5qtf---dev.firebaseapp.com",
  projectId: "ngapp---iec2cy5qtf---dev",
  storageBucket: "ngapp---iec2cy5qtf---dev.firebasestorage.app",
  messagingSenderId: "448716801979",
  appId: "1:448716801979:web:8da64bd0cc367f3abc269e",
  measurementId: "G-CPGBNP71XV",
  // databaseURL:
  //   "https://jfejcxjyujx-default-rtdb.europe-west1.firebasedatabase.app",
};
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ");
  console.log(payload);
  // Customize notification here
  // const notificationTitle = "Background Message --title";
  // const notificationTitle = payload.data.title;
  // const notificationOptions = {
  //   body: payload.data.body,
  //   icon: payload.data?.icon,
  // };
  // self.registration.showNotification(notificationTitle, notificationOptions);
});
