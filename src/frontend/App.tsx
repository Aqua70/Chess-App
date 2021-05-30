
import React, { useEffect, useState } from 'react'
import Login from './Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Temp from './Temp'
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
            {/* If the current URL is /about, this route is rendered
                while the rest are ignored */}


            <Route path="/login">
                <Login></Login>
            </Route>

            <Route path="/">
               {user === "" ? <Redirect to="/login"/> : <Temp/>}
            </Route>

            

            
          </Switch>
        </Router>
    </div>
  );
}

export default App;
