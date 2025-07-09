// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyANhq1KENwXBoIdrBfPteHvYH2tC6Oi-VI",
//   authDomain: "gameweb-8356a.firebaseapp.com",
//   projectId: "gameweb-8356a",
//   storageBucket: "gameweb-8356a.appspot.com", 
//   messagingSenderId: "198399315884",
//   appId: "1:198399315884:web:96b4b2aadba85bd6fbf409",
//   // measurementId: "G-0305Z54VSV"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// export { auth, db };

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyANhq1KENwXBoIdrBfPteHvYH2tC6Oi-VI",
//   authDomain: "gameweb-8356a.firebaseapp.com",
//   projectId: "gameweb-8356a",
//   storageBucket: "gameweb-8356a.appspot.com",
//   messagingSenderId: "198399315884",
//   appId: "1:198399315884:web:96b4b2aadba85bd6fbf409"
// };

// // Khởi tạo với try-catch để bắt lỗi
// let app;
// let db;
// let auth;

// try {
//   app = initializeApp(firebaseConfig);
//   db = getFirestore(app);
//   auth = getAuth(app);
//   console.log("Firebase initialized successfully");
// } catch (error) {
//   console.error("Firebase initialization error:", error);
// }

// export { auth, db };

// firebase.js

import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyANhq1KENwXBoIdrBfPteHvYH2tC6Oi-VI",
  authDomain: "gameweb-8356a.firebaseapp.com",
  projectId: "gameweb-8356a",
  storageBucket: "gameweb-8356a.appspot.com",
  messagingSenderId: "198399315884",
  appId: "1:198399315884:web:96b4b2aadba85bd6fbf409"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };

