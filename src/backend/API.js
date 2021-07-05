const fetch = require('node-fetch');
const oauthObj = require("./oauth")
const firebaseObj = require("./firebase")

var ndjsonStream = require('can-ndjson-stream');
const ndjson = require('ndjson')

const checkRefresh = async (email, id) =>{
    let token = await firebaseObj.getTokenFromUser(email, id);

    // Lichess removed support for refresh tokens
    // console.log(token, token.expired());
    // if(token.expired()){
    //     token = await token.refresh();
    //     firebaseObj.storeToken(email, id, token)
    // }

    return token;
}

const getUser = async (email, id) =>{
    const token = await checkRefresh(email, id);
    return fetch('https://lichess.org/api/account', {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    }
  }).then(res => res.json());
}

const getEmail = (token) =>{
    return fetch('https://lichess.org/api/account/email', {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    }
  }).then(res => res.json());
}

const getGameStream = async (email, id, gameId) =>{
  const token = await checkRefresh(email, id);
  return fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    }
  }).then(res => res.body);
}

const makeMove = async (email, id, gameId, move) =>{
  const token = await checkRefresh(email, id);
  return fetch(`https://lichess.org/api/board/game/${gameId}/move/${move}`, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    },
    method : 'POST'
  }).then(res => res.json());
}

const abort = async (email, id, gameId) =>{
  const token = await checkRefresh(email, id);

  return fetch(`https://lichess.org/api/board/game/${gameId}/abort`, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    }
  }).then(res => res.body);
  
}

const draw = async (email, id, gameId, accept) =>{
  const token = await checkRefresh(email, id);

  return fetch(`https://lichess.org/api/board/game/${gameId}/draw/${accept}`, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    }
  }).then(res => res.body);
  
}

const resign = async (email, id, gameId) =>{
  const token = await checkRefresh(email, id);
  return fetch(`https://lichess.org/api/board/game/${gameId}/resign`, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`
    }
  }).then(res => res.body);
  
} 

exports.getUser = getUser
exports.getEmail = getEmail
exports.getGameStream = getGameStream
exports.makeMove = makeMove
exports.abort = abort;
exports.draw = draw;
