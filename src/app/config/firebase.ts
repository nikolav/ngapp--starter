// update tools
// $ npm install -g firebase-tools
// $ firebase init

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import {
//   getMessaging,
//   isSupported as messagingIsSupported,
// } from "firebase/messaging";

// import {
//   getRemoteConfig,
//   isSupported as RCIsSupported,
// } from "firebase/remote-config";

import { PRODUCTION } from "./vars.env";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig_dev = {
  apiKey: "AIzaSyBSg5aYqpL5OXfa-4j9BCQYZMhUIDlmXsE",
  authDomain: "ngapp---iec2cy5qtf---dev.firebaseapp.com",
  projectId: "ngapp---iec2cy5qtf---dev",
  storageBucket: "ngapp---iec2cy5qtf---dev.firebasestorage.app",
  messagingSenderId: "448716801979",
  appId: "1:448716801979:web:8da64bd0cc367f3abc269e",
  measurementId: "G-CPGBNP71XV",
};

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig_production = {
  apiKey: "AIzaSyDiHp6uQWzodANM2R9_z-BwI6fjz1RwTJQ",
  authDomain: "ngapp---iec2cy5qtf.firebaseapp.com",
  projectId: "ngapp---iec2cy5qtf",
  storageBucket: "ngapp---iec2cy5qtf.firebasestorage.app",
  messagingSenderId: "891359693440",
  appId: "1:891359693440:web:a3d466c3437a2f90ca7465",
  measurementId: "G-TB1KFTL3E8",
};

export const config = PRODUCTION
  ? firebaseConfig_production
  : firebaseConfig_dev;

// Initialize Firebase
export const app = 0 < getApps().length ? getApp() : initializeApp(config);

// Initialize Cloud Firestore and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const remoteConfig = async () => {
//   try {
//     if (await RCIsSupported()) {
//       const serviceRC = getRemoteConfig(app);
//       // minimum fetch interval:
//       //   0     development
//       //   1hour production
//       serviceRC.settings.minimumFetchIntervalMillis = PRODUCTION ? 3600000 : 0;
//       return serviceRC;
//     }
//   } catch (error) {
//     // pass
//     console.error({ "remoteConfig:error": error });
//   }
//   return null;
// };
