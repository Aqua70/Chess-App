
import React, { useContext, useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";

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

    return(
        <div>
            <Link to="/">To home page</Link>
            <br/>
            <a href={authLink}>Login with lichess</a>
            <br/>
            OR LOGIN WITH EMAIl
        </div>
    )
}

export default Login