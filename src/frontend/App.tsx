
import React, { useEffect, useState } from 'react'
import Login from './Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Main from './Main'
import {getUser} from "./BackendFunctions"

function App() {

  const [user, setUser] = useState({});
  useEffect(() =>{
    getUser().then((user) => setUser(user));
  }, [])
  
  return (
    <div>
        <Router>
          <Switch>

            <Route path="/login">
                <Login></Login>
            </Route>

            <Route path="/">
               {user === "" ? <Redirect to="/login"/> : <Main user={user}/>}
            </Route>

            

            
          </Switch>
        </Router>
    </div>
  );
}

export default App;
