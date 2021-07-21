






import abortIcon from './icons/abortIcon.png';
import drawIcon from './icons/drawIcon.png';
import resignIcon from './icons/resignIcon.png';
import checkmarkIcon from "./icons/checkmarkIcon.png";
import xIcon from "./icons/xIcon.png";

import "./StatusButtons.css";
import {abort, draw, resign} from "./../BackendFunctions";
import React, { useState } from 'react';
import { useEffect } from 'react';

interface errorObj {
    error : string
};

function StatusButtons({gameObj, gameId, isWhite} : any){

    const [info, setInfo] = useState("");
    const [error, setError] = useState(false);
    const [wait, setWait] = useState({} as NodeJS.Timeout);
    const [opponentDraw, setOpponentDraw] = useState(false);

    useEffect(()=>{
        setInfo("");
        setOpponentDraw(false);
        if ((!isWhite && gameObj.wdraw) || (isWhite && gameObj.bdraw)){
            setOpponentDraw(true);
        }

    }, [gameObj, isWhite])

    const updateInfo = (outcome : Object, message : string, timeout : boolean) => {
        clearTimeout(wait);

        if (outcome.hasOwnProperty("error")){
            setError(true);
            setInfo((outcome as errorObj).error);
        }
        else{
            setInfo(message)
        }

        if (timeout){
            const w : NodeJS.Timeout =
            setTimeout(() => {
                setInfo("");
                setError(false);
            }, (2000));
    
            setWait(w);
        }


    }

    const abortClick = async () =>{
        const outcome = await abort(gameId);
        updateInfo(outcome, "Game aborted!", true);
    }

    const drawClick = async (accept : string) =>{          
        const outcome = await draw(gameId, accept);

        if (gameObj.moves.length < 8 || gameObj.status !== "started"){
            updateInfo({error: "Something went wrong with sending a draw offer"}, "asd", true);
            return
        }

        if (accept === "yes")
        {
            if (!opponentDraw)
                updateInfo(outcome, "Draw offer sent!", false);
            else
                updateInfo(outcome, "Draw offer accepted!", true);
        }
            
        if (accept === "no"){
            setOpponentDraw(false);
            updateInfo(outcome, "Draw offer declined!", true);
        }
            
    }

    const resignClick = async () =>{
        const outcome = await resign(gameId);
        const message = "";
        updateInfo(outcome, message, true);
    }
    
    return(
        <div className={"statusButtonContainer"}>
            <div className={"statusButtons"}>

                <button onClick={() => abortClick()} className={"shadowed statusButton " + (gameObj.moves.length < 8 && gameObj.status === "started" ? "goodButton" : "badButton")}>
                    <img className="icon" src={abortIcon} alt={"abort"}></img>
                </button>

                <button onClick={() => drawClick("yes")}className={"shadowed statusButton " + (gameObj.moves.length < 8 || gameObj.status !== "started" ? "badButton" : "goodButton")}>
                    <img className="icon" src={drawIcon} alt={"draw"}></img>
                </button>

                <button onClick={() => resignClick()} className={"shadowed statusButton " + (gameObj.moves.length < 8 || gameObj.status !== "started" ? "badButton" : "goodButton")}>
                    <img className="icon" src={resignIcon} alt={"resign"}></img>
                </button>

            </div>

            <div style={{height:"10%"} as React.CSSProperties}>
            </div>

            <div className={"statusButtonInfo"}>
                {!opponentDraw ?
                <h1 className={(error ? "errorStatus " : "infoStatus ") + "statusMessage"}>
                    {info}
                </h1>
                :
                <div className={"opponentDraw"}>
                    <h1 className={"statusMessage"}>
                        Opponent sent a draw offer. <br></br>
                        Accept?
                    </h1>
                    <div className={"opponentDrawButtons"}>
                        <button className={"shadowed badButton offerButton"} onClick={() => drawClick("no")}>
                            <img className="icon" src={xIcon} alt={"No"}></img>
                        </button>
                        <button className={"shadowed goodButton offerButton"} onClick={() => drawClick("yes")}>
                            <img className="icon" src={checkmarkIcon} alt={"Yes"}></img>
                        </button>
                    </div>
                </div>
                 }
            </div>
        </div>
    )
}

export default StatusButtons