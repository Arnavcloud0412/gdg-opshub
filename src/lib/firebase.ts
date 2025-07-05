
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBBGDVWvfLgqnW6pSaUHPLw03GChkxbte0",
  authDomain: "gdg-opshub.firebaseapp.com",
  projectId: "gdg-opshub",
  storageBucket: "gdg-opshub.appspot.com",
  messagingSenderId: "188075310126",
  appId: "1:188075310126:web:f8b8c8d8f8b8c8d8f8b8c8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;
