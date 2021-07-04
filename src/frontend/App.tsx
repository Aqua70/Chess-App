
import React, { useEffect, useState } from 'react'
import Login from './Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
  useLocation
} from "react-router-dom";
import Main from './Main'
import {getUser} from "./BackendFunctions"
import './App.css';
import Loader from "react-loader-spinner";
import  queryString from "query-string";
import pkceObj from "./PKCE";

function App() {

  return (
    <div className={"appDiv"}>
        <Router>
          <Switch>

            <Route path="/login">
                <Login></Login>
            </Route>

            <Route path="/:code?" component={MainPath}>

            </Route>

  
            
          </Switch>
        </Router>
        
    </div>
  );
}

function MainPath() {
  const isEmpty = (obj : Object) =>{
    return obj === "";
  }
  const [user, setUser] = useState({});
  const [isBusy, setIsBusy] = useState(true);
  const {search} = useLocation() as any

  useEffect(() =>{
    const effect = async () =>{
        getUser().then((user) => {
          setUser(user)
          setIsBusy(false);
        });
    }

    effect();

  }, [])

  
  
  return(
    isBusy ? 
      <div className="loaderContainer">
        <Loader type="ThreeDots" color="dark" height="150px" width="150px"></Loader>
      </div>
     : isEmpty(user) ? <Redirect to="/login"/> : <Main user={user}/>
  )
}
export default App;
