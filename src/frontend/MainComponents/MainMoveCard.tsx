import React, { useEffect, useState } from "react";

import "./MainMoveCard.css"
import {getUser, makeMove} from "../BackendFunctions"

function MoveCard({gameId, currTurn, isWhite, moves, winner} : any){
    

    const [move, setMove] = useState("");
    const [error, setError] = useState("");

    const textChange = (e : React.ChangeEvent<HTMLInputElement>) : void =>{
        setMove(e.target.value);
    }

    const submitClick = async (e : React.FormEvent<HTMLFormElement>) : Promise<void> =>{
        e.preventDefault();
        const outcome = await makeMove(move, gameId);
        
        
        if (outcome.error && error === ""){
            setError(outcome.error);

            setTimeout(() => {
                setError("");
            }, 2000);
        }
    } 

    return(
        <div className={"moveCard"}>
            <h1 className={"message"}>
                {(currTurn === "white" && isWhite) || (currTurn !== "white" && !isWhite) ? "My" : "Opponent's"} turn {`(${currTurn})`}
            </h1>

            <div className={"moveFormDiv"}>
                <form className={"moveForm"} onSubmit={(e) => submitClick(e)}>
                    <input className={"moveSubmit"} type="text" onChange={textChange}/>
                </form>
            </div>

            <h1 className={"bad message"}>
                {error}
            </h1>

            <h1 className={"message"}>
                Last move:
                <br></br><br></br>
                {moves[moves.length - 1]}
            </h1>
            <br></br>
            <br></br>
            <br></br>
            {winner ? 
            (winner === "white" && isWhite) || (winner !== "white" && !isWhite) ?
            <h1 className={"good largeMessage"}>
                The winner is {winner}!
            </h1>
            :
            <h1 className={"bad largeMessage"}>
                The winner is {winner}!
            </h1>
            
            : <></>
            }
            

        </div>
    )
}

export default MoveCard