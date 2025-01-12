import { PRODUCTION } from "../config";

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

export const firebaseConfig = PRODUCTION
  ? firebaseConfig_production
  : firebaseConfig_dev;
