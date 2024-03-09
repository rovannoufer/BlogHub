import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6bDZVhwEM6I6ZAMEOqmRYoTOxFDn-ZEA",
  authDomain: "bloghub-460f9.firebaseapp.com",
  projectId: "bloghub-460f9",
  storageBucket: "bloghub-460f9.appspot.com",
  messagingSenderId: "1063610171857",
  appId: "1:1063610171857:web:f47d61263cb0a9628ea0f0",
  measurementId: "G-Z49679EMY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;
    await signInWithPopup(auth, provider)
    .then((result) =>{
         user=result.user;
    }).catch((err) =>{
        console.log(err);
    })

    return user;
}