import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDo67MSG0PAcFAFL4_9i6MPNdW4FPJ0-Wk",
  authDomain: "classy-jerry-admin.firebaseapp.com",
  projectId: "classy-jerry-admin",
  storageBucket: "classy-jerry-admin.appspot.com",
  messagingSenderId: "901890499651",
  appId: "1:901890499651:web:8125e6062ffe65166b20f6"
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
