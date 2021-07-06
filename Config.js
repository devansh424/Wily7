import firebase from 'firebase';
require("@firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyBPoQ63--WZXN91cvfIMs6KiXqDbsbdu3o",
    authDomain: "wilyapp-33bf0.firebaseapp.com",
    projectId: "wilyapp-33bf0",
    storageBucket: "wilyapp-33bf0.appspot.com",
    messagingSenderId: "201864638319",
    appId: "1:201864638319:web:474325b4c9bcebc49d029a"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();