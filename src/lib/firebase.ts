
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "taskmaster-9thnp",
  "appId": "1:904235816848:web:b90c52644fba48616f4515",
  "storageBucket": "taskmaster-9thnp.firebasestorage.app",
  "apiKey": "AIzaSyC_YUKLw9M1vtxO0ksnPSHQ1neuFEUMmyI",
  "authDomain": "taskmaster-9thnp.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "904235816848"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
