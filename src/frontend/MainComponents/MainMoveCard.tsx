import React, {useState } from "react";

import "./MainMoveCard.css"
import {makeMove} from "../BackendFunctions"

function MoveCard({gameObj, gameId, currTurn, isWhite, moves, winner} : any){
    

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

    const myTurn = (currTurn === "white" && isWhite) || (currTurn !== "white" && !isWhite);

    return(
        <div className={"moveCard"}>
            <h1 className={"message"}>
                {myTurn ? "My" : "Opponent's"} turn {`(${currTurn})`}
            </h1>

            <div className={"moveFormDiv"}>
                <form className={"moveForm"} onSubmit={(e) => submitClick(e)}>
                    <input className={"moveSubmit"} type="text" onChange={textChange} placeholder={"Enter your move in UCI format"}/>
                </form>
            </div>

            <h1 className={"bad message"}>
                {error}
            </h1>

            <div className={"lastMoves"}>

                <div className={"halfMessage"}>
                    <h1 className={"message"}>
                        My <br></br>last move:
                        <br></br><br></br>
                        {myTurn ? moves[moves.length - 2] : moves[moves.length - 1]}
                    </h1>
                </div>

                <div className={"halfMessage"}>
                    <h1 className={"message"}>
                        Opponent's <br></br>last move:
                        <br></br><br></br>
                        {myTurn ? moves[moves.length - 1] : moves[moves.length - 2]}
                    </h1>
                </div>

            </div>

            <div className="infoMessage">
                {winner ? 
                <h1 className={((winner === "white" && isWhite) || (winner !== "white" && !isWhite) ? "good" : "bad") + " largeMessage"}>
                    The winner is {winner}!
                </h1>
                : <></>
                }
                {gameObj.status === "aborted" ?
                <h1 className={"info largeMessage"}>
                    The game has been aborted.
                </h1>
                : <></>
                }
                {
                gameObj.status === "draw" ?
                <h1 className={"info largeMessage"}>
                    The game has been drawn.
                </h1>
                : <></>
                }
            </div>

        </div>
    )
}

export default MoveCard