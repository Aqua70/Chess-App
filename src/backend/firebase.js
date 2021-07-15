const firebase = require('firebase')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID
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