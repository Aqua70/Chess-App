
import {useEffect, useState } from 'react'



import { getAuthLink } from './BackendFunctions';
import Loader from "react-loader-spinner";

import "./Login.css";


function Login(){
    const [authLink, setAuthLink] = useState("");

    useEffect(()=>{
        const aFunc = async () =>{
            const link = await getAuthLink();
            setAuthLink(link);
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
            // <Loader type="ThreeDots" color="dark" height="150px" width="150px"></Loader>
            <></>
            }
        </div>
    )
}

export default Login