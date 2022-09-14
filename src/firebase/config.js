import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY_2}`,
  authDomain: `${process.env.REACT_APP_AUTH_DOMAIN_2}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID_2}`,
  storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET_2}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID_2}`,
  appId: `${process.env.REACT_APP_APP_ID_2}`
};

// Initialize Firebase
initializeApp(firebaseConfig)

// init firestore
const db = getFirestore()
const fbTimestamp = serverTimestamp()

// init firebase auth
const auth = getAuth()
const googleAuth = new GoogleAuthProvider()

// init firebase storage
const storage = getStorage()

export { db, auth, fbTimestamp, googleAuth, storage }
