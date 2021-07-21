var cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express');
const path = require("path");
const crypto = require('crypto');
const favicon = require('serve-favicon');
// const functions = require('firebase-functions');

const oauthObj = require("./oauth");
const firebaseObj = require("./firebase");
const API = require('./API');
const { APIroute } = require("./expressAPI")


let guid = () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// console.log("\n\n\n\n\n", process.env.NODE_ENV , "\n\n\n\n\n");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const redirect = process.env.CALLBACK;
const scope = process.env.SCOPE;
const client_id = process.env.ID;
const PORT = process.env.PORT || 8087;

const app = express();



app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use(favicon(path.join(__dirname, "../../build/favicon.ico")));
app.use(express.static(path.join(__dirname, "../../build")))


app.get("/auth", async (req, res) => {
  
  function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  const code_verifier = makeid(45);
  res.cookie("code", code_verifier);
  async function generateCodeChallenge() {

    return crypto.createHash('sha256').update(code_verifier).digest('base64')
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  }
  const generateAuthuri = async () =>{
    const code_challenge = await generateCodeChallenge();
    return `${process.env.AUTHENDPOINT}?response_type=code&client_id=${client_id}&state=${makeid(50)}&scope=${scope}&redirect_uri=${redirect}&code_challenge=${code_challenge}&code_challenge_method=S256`
  }
  res.send({link: await generateAuthuri()});
});



app.get('/callback', async (req, res) => {

  const code = req.query.code
  const code_verifier = req.cookies.code


  let token = await oauthObj.getTokenFromCode(code, code_verifier);
  if (token.error){
    res.status(500).send("There was a verification problem. Please try again. Make sure cookies are enabled");
    
    res.end();
    return;
  }

  const emailObj  = await API.getEmail(token);
  
  var id;
  if (await firebaseObj.exists(emailObj.email)){
    id = await firebaseObj.getUserId(req.cookies.email);
  }
  else{
    id = guid();
  }

  firebaseObj.storeToken(emailObj.email, id, token);

  res.cookie("id", id , {maxAge: token.expires_in * 1000});
  res.cookie("email", emailObj.email, {maxAge: token.expires_in * 1000});

  res.writeHead(302, {
    Location: process.env.CALLBACK_REDIRECT,
  });
  
  res.end();
});

app.use("/", APIroute);

app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname, "../../build/index.html"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// module.exports.app = functions.https.onRequest(app);