
const cors = require('cors')
const express = require('express');
const oauthObj = require("./oauth");
const firebaseObj = require("./firebase");
const API = require('./API');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const port = process.env.PORT || 8087;

const app = express();

app.use(cors())

app.get('/', (_, res) => res.send('Hello<br><a href="/auth">Log in with lichess</a>'));

app.get('/auth', (_, res) => {
  // res.send("asd");
  res.send({link : oauthObj.authorizationUri});
});

var emailObj = null;
app.get('/callback', async (req, res) => {

  const token = await oauthObj.getTokenFromCode(req.query.code);

  emailObj = await API.getEmail(token);
 
  firebaseObj.storeToken(emailObj.email, token);

  res.writeHead(302, {
    Location: `http://localhost:3000/temp`
  });
  res.end();
  
});

app.get('/user', async (req, res) => {

  // Get token from firebase

  // Remove this later once we get email from the req object
  await setTimeout(() => {}, 1000)
  
  
  const token = await firebaseObj.getTokenFromMail(emailObj.email)
  
  const user = await API.getUser(token);

  res.send(user);
});

app.listen(port, () => console.log(`Server started on port ${port}`));