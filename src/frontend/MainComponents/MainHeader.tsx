import React, {useState } from "react";

function Header( {setId} : any ){
    

    const [link, setLink] = useState("");

    const parseLink = (link : string) : string => {
        if (link.indexOf("/") === -1){
            return link;
        }

        return link.slice(link.lastIndexOf("/") + 1);
    }

    const textChange = (e : React.ChangeEvent<HTMLInputElement>) : void =>{
        setLink(e.target.value);
    }

    const submitClick = (e : React.ChangeEvent<HTMLInputElement>) : void =>{
        e.preventDefault();
        setId(parseLink(link));
    } 

    return(
        <>
            <h1>Enter the id or link of the game you want to play!</h1>
            <form>
                <input type="text" onChange={textChange}/>
                <button type="submit" onClick={(e : any) => submitClick(e)}>Submit</button>
            </form>
        </>
    )
}

export default Header