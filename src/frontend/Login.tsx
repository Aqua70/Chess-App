
import React, { useContext, useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
import {getAuthLink} from './BackendFunctions'


function Login(){

    const [authLink, setAuthLink] = useState("");




    useEffect(()=>{
        const aFunc = async () =>{
            const link = await getAuthLink()
            setAuthLink(link)
        }
        aFunc()
    }, [])

    const login = () =>{
      document.location.href = authLink;
    }


    return(
        <div>
            <Link to="/">To home page</Link>
            <br/>
            {authLink !== "" ? <button onClick={login}>Login using lichess</button> : "WAIT"}
            <br/>
            <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input type="text" />
        </label>
        <label>
          <p>Password</p>
          <input type="password" />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
        </div>
    )
}

export default Login