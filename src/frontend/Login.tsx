
import {useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";

// import { encode as base64encode } from "base64-arraybuffer";

// import Cookies from 'universal-cookie';
import { getAuthLink } from './BackendFunctions';





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
        <div>
            <Link to="/">To home page</Link>
            <br/>
            {authLink !== "" ? <button className={"loginButton"} onClick={login}>Login using lichess</button> : "WAIT"}
            <br/>
        </div>
    )
}

export default Login