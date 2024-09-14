import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_naeI7za_lZWgTSIHXYSa1vlKaF9PyTM",
  authDomain: "tourism-recommendation-s-31a55.firebaseapp.com",
  databaseURL: "https://tourism-recommendation-s-31a55-default-rtdb.firebaseio.com/",
  projectId: "tourism-recommendation-s-31a55",
  storageBucket: "tourism-recommendation-s-31a55.appspot.com",
  messagingSenderId: "289960783561",
  appId: "1:289960783561:web:74a695eddf06cf3e662718",
  measurementId: "G-D6FVEQ3JMP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app);
const storage = getStorage(app);


export { app, auth ,database,storage};
