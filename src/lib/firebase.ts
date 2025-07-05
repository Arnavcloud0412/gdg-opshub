
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
  appId: "1:188075310126:web:your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
