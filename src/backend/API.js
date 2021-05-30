const fetch = require('node-fetch');
const oauthObj = require("./oauth")
const firebaseObj = require("./firebase")

const checkRefresh = async (email) =>{

    let token = await firebaseObj.getTokenFromMail(email);

    if(token.expired()){
        token = await token.refresh();
        firebaseObj.storeToken(email, token)
    }

    return token;
}

const getUser = async (email) =>{
    token = await checkRefresh(email);
    return fetch('https://lichess.org/api/account', {
    headers: {
      'Authorization': `Bearer ${token.token.access_token}`
    }
  }).then(res => res.json());
}

const getEmail = (token) =>{
    return fetch('https://lichess.org/api/account/email', {
    headers: {
      'Authorization': `Bearer ${token.token.access_token}`
    }
  }).then(res => res.json());
}

const getGames = async (email) =>{
  
}

exports.getUser = getUser
exports.getEmail = getEmail