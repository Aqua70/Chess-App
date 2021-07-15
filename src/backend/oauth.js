const axios = require('axios').default
const fetch = require('node-fetch');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const tokenEndpoint = process.env.TOKENENDPOINT;
const redirect_uri = process.env.CALLBACK

const getTokenFromCode = (code, code_verifier) =>{
  return fetch(tokenEndpoint, {
    method: "POST",
    body: JSON.stringify({
      grant_type: "authorization_code",
      code:code, // That we have received in authorization request
      code_verifier: code_verifier, // generated in the first step
      redirect_uri: redirect_uri,
      client_id: process.env.ID
    }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
};

exports.getTokenFromCode = getTokenFromCode




