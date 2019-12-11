import firebase from 'firebase/app';
import firestore from 'firebase/firestore'; // eslint-disable-line no-unused-vars

var firebaseConfig = {

  };

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
