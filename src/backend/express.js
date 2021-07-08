var cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express');
const oauthObj = require("./oauth");
const firebaseObj = require("./firebase");
const API = require('./API');
const crypto = require('crypto');

let guid = () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const redirect = process.env.CALLBACK;
const scope = process.env.SCOPE;
const client_id = process.env.ID;

const port = process.env.PORT || 8087;

const app = express();

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.get('/', (_, res) => res.send('Hello<br><a href="/auth">Log in with lichess</a>'));

app.get("/auth", async (req, res) =>{
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  async function generateCodeChallenge() {
    const code_verifier = makeid(45);
    
    res.cookie("code", code_verifier);

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
    res.status(500).send(token.error_description);
    
    res.end();
    return;
  }

  const emailObj  = await API.getEmail(token);
  const id = guid();
  
  firebaseObj.storeToken(emailObj.email, id, token);
  console.log(token);
  res.cookie("email", emailObj.email, {maxAge: token.expires_in * 1000});
  res.cookie("id", id , {maxAge: token.expires_in * 1000});

  res.writeHead(302, {
    Location: process.env.CALLBACK_REDIRECT,
  });
  
  res.end();
});

app.get('/user', async (req, res) => {

  const email = req.cookies.email;
  const id = req.cookies.id;

  if (!email || !id){
    res.end()
    return
  }
  
  const user = await API.getUser(email, id);

  res.send(user);
});


app.get('/gameStream/:id', async (req, res) =>{
    const gameId = req.params.id

    const email = req.cookies.email;
    const id = req.cookies.id;


    if (!email || !id){
      res.end()
      return
    }

    const game = await API.getGameStream(email, id, gameId);
    // console.log(game);
    // const stream = ndjson.parse();

    game.pipe(res);

    // stream.on("data", (chunk) =>{
    //   console.log(chunk);
    // })

    // stream.pipe(res);
    // res.end();

})

app.post("/makeMove", async (req, res) =>{
  const move = req.body.move
  const gameId = req.body.id


  const email = req.cookies.email;
  const id = req.cookies.id;

  const success = await API.makeMove(email, id, gameId, move);
  res.send(success);

});

app.post("/abort/:id", async (req, res) =>{
  const gameId = req.params.id;
  const email = req.cookies.email;
  const id = req.cookies.id;

  if (!email || !id){
    res.end()
    return
  }
  const success = await API.abort(email,id,gameId);
  success.pipe(res);
});

app.post("/draw/:id/:accept", async (req, res) =>{
  const accept = req.params.accept;
  const gameId = req.params.id;
  const email = req.cookies.email;
  const id = req.cookies.id;

  // console.log(accept, gameId);
  console.log(accept);
  if (!email || !id){
    res.end()
    return
  }
  const success = await API.draw(email, id, gameId, accept);

  // success.on("data", (chunk)=>{
  //   var string = new TextDecoder().decode(chunk);
  //   console.log(string);
  // })

  success.pipe(res);
});

app.post("/resign/:id/", async (req, res) =>{
  const gameId = req.params.id;
  const email = req.cookies.email;
  const id = req.cookies.id;

  if (!email || !id){
    res.end()
    return
  }
  const success = await API.resign(email, id, gameId);
  success.pipe(res);
});

app.listen(port, () => console.log(`Server started on port ${port}`));