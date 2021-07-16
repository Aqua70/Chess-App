
import {useEffect, useState } from 'react'



import { getAuthObj } from './BackendFunctions';

import "./Login.css";


function Login(){
    const [authLink, setAuthLink] = useState("");
    useEffect(()=>{
        const aFunc = async () =>{
            const authOjb = await getAuthObj();
            setAuthLink(authOjb.link);
        }
        aFunc()
    }, [])

    const login = () =>{
      document.location.href = authLink;
    }


    return(
        <div className={"loginContainer"}>
            <h1 className={"welcomeText"}>
                Welcome to blindchess!
            </h1>
            {authLink !== "" ? 
            <div className={"loginButton"} onClick={login}>Click here to login using lichess</div> : 
            <></>
            }
        </div>
    )
}

export default Login