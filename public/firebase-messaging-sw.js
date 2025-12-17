// # ./firebase-messaging-sw.js
// Service Worker for Firebase Cloud Messaging (FCM)
// Purpose: log background message payloads (no notifications)

(() => {
  "use strict";

  // Keep both compat scripts on the exact same version
  const FIREBASE_VERSION = "11.10.0";
  const TAG = "[firebase-messaging-sw]";
  const nowIso = () => new Date().toISOString();

  // Optional: reduce noise in production by toggling this
  const DEBUG = true;

  const log = (...args) => {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.log(TAG, nowIso(), ...args);
  };

  const warn = (...args) => {
    // eslint-disable-next-line no-console
    console.warn(TAG, nowIso(), ...args);
  };

  try {
    importScripts(
      `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-compat.js`,
      `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging-compat.js`
    );
  } catch (e) {
    warn("importScripts failed; FCM SW will be inactive.", e);
    return;
  }

  if (!self.firebase?.initializeApp) {
    warn("Firebase compat SDK not available on self.firebase; aborting.");
    return;
  }

  // Keep config minimal for SW usage
  const firebaseConfig = {
    apiKey: "AIzaSyBSg5aYqpL5OXfa-4j9BCQYZMhUIDlmXsE",
    authDomain: "ngapp---iec2cy5qtf---dev.firebaseapp.com",
    projectId: "ngapp---iec2cy5qtf---dev",
    storageBucket: "ngapp---iec2cy5qtf---dev.firebasestorage.app",
    messagingSenderId: "448716801979",
    appId: "1:448716801979:web:8da64bd0cc367f3abc269e",
    measurementId: "G-CPGBNP71XV",
  };

  // Avoid double-init if SW is re-evaluated
  try {
    if (!self.firebase.apps?.length) {
      self.firebase.initializeApp(firebaseConfig);
      log("Firebase initialized.");
    } else {
      log("Firebase already initialized.");
    }
  } catch (e) {
    warn("Firebase initializeApp failed; aborting.", e);
    return;
  }

  let messaging;
  try {
    messaging = self.firebase.messaging();
  } catch (e) {
    warn("firebase.messaging() failed; aborting.", e);
    return;
  }

  // Background messages arrive here when:
  // - a push is received AND
  // - the page isn't focused/active to receive onMessage()
  messaging.onBackgroundMessage((payload) => {
    // Log the whole payload + a few useful fields
    try {
      log("Received background message payload:", payload);

      // Optional: quick summary to scan logs faster
      const summary = {
        from: payload?.from,
        collapseKey: payload?.collapseKey,
        messageId: payload?.messageId,
        hasNotification: Boolean(payload?.notification),
        dataKeys: payload?.data ? Object.keys(payload.data) : [],
      };
      log("Payload summary:", summary);
    } catch (e) {
      warn("Error while logging payload:", e);
    }
  });

  // (Optional) lifecycle logs – helpful while debugging SW updates
  self.addEventListener("install", () => log("install"));
  self.addEventListener("activate", () => log("activate"));
})();
