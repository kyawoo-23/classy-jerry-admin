import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAQNTHQqrQjPCjQE4dngUlnarC8I8kEZFA",
  authDomain: "classy-jerry.firebaseapp.com",
  projectId: "classy-jerry",
  storageBucket: "classy-jerry.appspot.com",
  messagingSenderId: "231236747450",
  appId: "1:231236747450:web:3c298936c2a4a009e10283"
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
