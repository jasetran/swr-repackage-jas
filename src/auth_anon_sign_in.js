const functions = require('firebase-functions');

//import { getAuth, signInAnonymously } from "firebase/auth";

console.log(functions)
const auth = getAuth();
signInAnonymously(auth)
    .then(() => {
        // Signed in..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
    });
