
import React, { useContext, useEffect, useState } from 'react'
import {
  Link
} from "react-router-dom";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
import {getAuthLink} from './BackendFunctions'

import { encode as base64encode } from "base64-arraybuffer";

import Cookies from 'universal-cookie';






const redirect = "http://localhost:8087/callback";
const scope = 'preference:read board:play email:read';
const client_id = 'necyoTSYxRMyy4Eb';

function Login(){
    const [authLink, setAuthLink] = useState("");


    
    function makeid(length : number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    async function generateCodeChallenge() {
      const code_verifier = makeid(45);
      const cookies = new Cookies();
      cookies.set('code', code_verifier, { path: '/' });
      
      const encoder = new TextEncoder();
      const data = encoder.encode(code_verifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      const base64Digest = base64encode(digest);
      // you can extract this replacing code to a function
      return base64Digest
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    }
    const generateAuthuri = async () : Promise<string> =>{
      const code_challenge = await generateCodeChallenge();
      return `https://lichess.org/oauth?response_type=code&client_id=${client_id}&state=${makeid(50)}&scope=${scope}&redirect_uri=${redirect}&code_challenge=${code_challenge}&code_challenge_method=S256`
    }

    useEffect(()=>{
        const aFunc = async () =>{
            const link = await generateAuthuri();
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