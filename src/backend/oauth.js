
const oauth = require('simple-oauth2');
const axios = require('axios').default

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/* --- Fill in your app config here --- */


const client = new oauth.AuthorizationCode({
  client: {
    id: process.env.ID,
    secret: process.env.SECRET
  },
  auth: {
    tokenHost: 'https://oauth.lichess.org',
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth'
  },
  http: {
    json: true
  }
});

const redirectUri = process.env.CALLBACK;

const authorizationUri = client.authorizeURL({
  redirect_uri: redirectUri,
  scope: ['preference:read board:play email:read'], // see https://lichess.org/api#section/Introduction/Rate-limiting
  state: Math.random().toString(36).substring(2)
});

const getTokenFromCode = (code) =>{
  return client.getToken({
    code: code, 
    redirect_uri: redirectUri
  })
};




exports.authorizationUri = authorizationUri
exports.redirectUri = redirectUri
exports.getTokenFromCode = getTokenFromCode
exports.client = client



