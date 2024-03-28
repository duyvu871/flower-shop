// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBR06G87xW-mDGqyXvmGlPtmmNa1QWdV-w",
    authDomain: "commanau-85983.firebaseapp.com",
    projectId: "commanau-85983",
    storageBucket: "commanau-85983.appspot.com",
    messagingSenderId: "515863069412",
    appId: "1:515863069412:web:1d7c3d14a5c255ecc1a2f1",
    measurementId: "G-RXTH795EF7"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);