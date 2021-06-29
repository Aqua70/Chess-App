var cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express');
const oauthObj = require("./oauth");
const firebaseObj = require("./firebase");
const API = require('./API');


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

const port = process.env.PORT || 8087;

const app = express();

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.get('/', (_, res) => res.send('Hello<br><a href="/auth">Log in with lichess</a>'));

app.get('/auth', (_, res) => {
  // res.send("asd");
  res.send({link : oauthObj.authorizationUri});
});

var emailObj = null;
app.get('/callback', async (req, res) => {
  
  const token = await oauthObj.getTokenFromCode(req.query.code);

  emailObj = await API.getEmail(token);

  const id = guid();

  firebaseObj.storeToken(emailObj.email, id, token);

  res.cookie("email", emailObj.email);
  res.cookie("id", id);

  res.writeHead(302, {
    Location: `http://localhost:3000/temp`,
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

    game.pipe(res);

})

app.post("/makeMove", async (req, res) =>{
  const move = req.body.move
  const gameId = req.body.id


  const email = req.cookies.email;
  const id = req.cookies.id;

  const success = await API.makeMove(email, id, gameId, move);
  res.send(success);

});


app.listen(port, () => console.log(`Server started on port ${port}`));