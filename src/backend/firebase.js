const firebase = require('firebase')
const oauthObj = require("./oauth");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAZIAGz06TTmV411kwDoMlAwcGPexyBQ7w",
    authDomain: "chess-app-990ca.firebaseapp.com",
    databaseURL: "https://chess-app-990ca-default-rtdb.firebaseio.com",
    projectId: "chess-app-990ca",
    storageBucket: "chess-app-990ca.appspot.com",
    messagingSenderId: "627580634173",
    appId: "1:627580634173:web:59d288a59d895623c91654",
    measurementId: "G-Y43SKCBYQN"
};


firebase.initializeApp(firebaseConfig)

let database = firebase.firestore()

const tokens = database.collection("tokens");


const storeToken = (email, id, token) =>{
    tokens.doc(email).set({token : token, id});
}


const getTokenFromUser = (email, id) => {
    return tokens.doc(email).get()
    .then((doc) => {
        if (!doc.exists || doc.data().id !== id){
            // TODO: throw error instead
            return -1
        } 
        return doc.data().token;
    });
}


exports.storeToken = storeToken
exports.getTokenFromUser = getTokenFromUser