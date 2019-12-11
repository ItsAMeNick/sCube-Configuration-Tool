import firebase from 'firebase/app';
import firestore from 'firebase/firestore'; // eslint-disable-line no-unused-vars

var firebaseConfig = {
    apiKey: "AIzaSyBjKUR9fegcyWuPJMxRhQ6vYS64lG9Bf5U",
    authDomain: "scube-config.firebaseapp.com",
    databaseURL: "https://scube-config.firebaseio.com",
    projectId: "scube-config",
    storageBucket: "scube-config.appspot.com",
    messagingSenderId: "629486228482",
    appId: "1:629486228482:web:4cf554742f75143917431b"
  };

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
