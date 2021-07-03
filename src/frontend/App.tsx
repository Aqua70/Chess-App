
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
import './App.css';
import Loader from "react-loader-spinner";
function App() {

  const [user, setUser] = useState({});
  const [isBusy, setIsBusy] = useState(true);

  const isEmpty = (obj : Object) =>{
    console.log(obj, obj === "");
    return obj === "";
  }

  useEffect(() =>{
    getUser().then((user) => {
      setUser(user)
      setIsBusy(false);
    });
  }, [])
  
  return (
    <div className={"appDiv"}>
        <Router>
          <Switch>

            <Route path="/login">
                <Login></Login>
            </Route>

            <Route path="/">
              
               {isBusy ? 
                <div className="loaderContainer">
                  <Loader type="ThreeDots" color="dark" height="150px" width="150px"></Loader>
                </div>
               : isEmpty(user) ? <Redirect to="/login"/> : <Main user={user}/>}
            </Route>

            

            
          </Switch>
        </Router>
        
    </div>
  );
}

export default App;
