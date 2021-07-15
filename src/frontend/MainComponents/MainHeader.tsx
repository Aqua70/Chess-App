import React, {useState } from "react";
import { useHistory } from "react-router";

import "./MainHeader.css";

function Header( {setId} : any ){
    
    const history = useHistory();
    const [link, setLink] = useState("");

    const routeChange = ()=> {
        let path = `/login`;
        history.push(path);
      }

    const parseLink = (link : string) : string => {
        if (link.indexOf("/") === -1){
            return link;
        }

        return link.slice(link.lastIndexOf("/") + 1);
    }

    const textChange = (e : React.ChangeEvent<HTMLInputElement>) : void =>{
        e.preventDefault();
        setLink(e.target.value);
    }

    const submitClick = (e : React.FormEvent<HTMLFormElement>) : void =>{
        e.preventDefault();
        setId(parseLink(link));
    } 

    return(
            <div className={"headerContainer"}>
                <div className={"idContainer"}>
                    <h1 className={"headerText"}>
                        Enter the id or link of the game you want to play!
                    </h1>
                    <form className={"idForm"} onSubmit={(e) => submitClick(e)}>
                        <input className={"idText"} type="text" onChange={textChange}/>
                    </form>
                </div>

                <div className={"toLoginButton"} onClick={routeChange}>Go to login page</div>


            </div>
    )
}

export default Header