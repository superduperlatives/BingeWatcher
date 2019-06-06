import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJuJHHf2txiuyxYODzn0GUzac1Ewtx5Zw",
    authDomain: "superduperlatives.firebaseapp.com",
    databaseURL: "https://superduperlatives.firebaseio.com",
    projectId: "superduperlatives",
    storageBucket: "superduperlatives.appspot.com",
    messagingSenderId: "91289186734",
    appId: "1:91289186734:web:ff796a4e3ea069f3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase