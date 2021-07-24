import firebase from 'firebase';
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyDUjRftqR0lu6cVPZdcJcsqUdSrQtxvuSA",
  authDomain: "wily-d3a5e.firebaseapp.com",
  projectId: "wily-d3a5e",
  storageBucket: "wily-d3a5e.appspot.com",
  messagingSenderId: "508778952379",
  appId: "1:508778952379:web:29318b12df5a8131709b9e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();