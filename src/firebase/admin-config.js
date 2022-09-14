import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY_1}`,
  authDomain: `${process.env.REACT_APP_AUTH_DOMAIN_1}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID_1}`,
  storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET_1}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID_1}`,
  appId: `${process.env.REACT_APP_APP_ID_1}`
};

// Initialize Firebase
const secondaryApp = initializeApp(firebaseConfig, "secondary")

// init firestore
const db = getFirestore(secondaryApp)
const fbTimestamp = serverTimestamp(secondaryApp)

// init firebase auth
const auth = getAuth(secondaryApp)
const googleAuth = new GoogleAuthProvider(secondaryApp)

// init firebase storage
const storage = getStorage(secondaryApp)

export { db, auth, fbTimestamp, googleAuth, storage }
