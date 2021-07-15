const app = require('express').Router();
const API = require('./API.js');

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
  
    if (!email || !id){
      res.end()
      return
    }
    const success = await API.draw(email, id, gameId, accept);
  
  
  
    success.pipe(res);
  });
  
app.post("/resign/:id", async (req, res) =>{
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
  
app.post("/message/:id", async (req, res) =>{
    const gameId = req.params.id;
    const message = req.body.message;
  
    const email = req.cookies.email;
    const id = req.cookies.id;
    
    if (!email || !id){
      res.end();
      return
    }
  
    const success = await API.message(email, id, gameId, message);
    
    res.send(success);
  })



exports.APIroute = app;