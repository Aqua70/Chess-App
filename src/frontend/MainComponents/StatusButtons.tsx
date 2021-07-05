






import abortIcon from './icons/abortIcon.png';
import drawIcon from './icons/drawIcon.png';
import resignIcon from './icons/resignIcon.png';

import "./StatusButtons.css";
import {abort, draw, resign} from "./../BackendFunctions";
import React, { useState } from 'react';

interface errorObj {
    error : string
};

function StatusButtons({gameObj, gameId} : any){

    const [info, setInfo] = useState("");
    const [error, setError] = useState(false);
    const [wait, setWait] = useState({} as NodeJS.Timeout);
    const updateInfo = (outcome : Object, message : string) => {
        clearTimeout(wait);

        if (outcome.hasOwnProperty("error")){
            setError(true);
            setInfo((outcome as errorObj).error);
        }
        else{
            setInfo(message)
        }
        const w : NodeJS.Timeout =
        setTimeout(() => {
            setInfo("");
            setError(false);
        }, (2000));

        setWait(w);

    }

    const abortClick = async () =>{
        const outcome = await abort(gameId);
        updateInfo(outcome, "Game aborted!");
    }

    const drawClick = async () =>{
        const outcome = await draw(gameId, "yes");

        if (gameObj.moves.length < 8 || gameObj.status !== "gameStarted"){
            updateInfo({error: "Something went wrong with sending a draw offer!"}, "asd");
            return
        }
        updateInfo(outcome, "Draw offer sent!");
    }

    const resignClick = async () =>{
        const outcome = await resign(gameId);
        const message = gameObj.moves.length < 8 ? "Game aborted!" : "Game resigned!"
        updateInfo(outcome, message);
    }
    console.log(gameObj.status);
    
    return(
        <div className={"statusButtonContainer"}>
            <div className={"statusButtons"}>

                <button onClick={() => abortClick()} className={"shadowed statusButton " + (gameObj.moves.length < 8 && gameObj.status === "started" ? "goodButton" : "badButton")}>
                    <img className="icon" src={abortIcon} alt={"abort"}></img>
                </button>

                <button onClick={() => drawClick()}className={"shadowed statusButton " + (gameObj.moves.length < 8 || gameObj.status !== "started" ? "badButton" : "goodButton")}>
                    <img className="icon" src={drawIcon} alt={"draw"}></img>
                </button>

                <button onClick={() => resignClick()} className={"shadowed statusButton " + (gameObj.moves.length < 8 || gameObj.status !== "started" ? "badButton" : "goodButton")}>
                    <img className="icon" src={resignIcon} alt={"resign"}></img>
                </button>

            </div>

            <div style={{height:"30%"} as React.CSSProperties}>
            </div>

            <div className={"statusButtonInfo"}>
                <h1 className={(error ? "errorStatus " : "infoStatus ") + "statusMessage"}>
                    {info}
                </h1>
            </div>
        </div>
    )
}

export default StatusButtons