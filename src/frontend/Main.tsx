import React, { useEffect, useState } from "react";
import MainHeader from "./MainComponents/MainHeader"
import MoveCard from "./MainComponents/MainMoveCard";
import TimerColumn from "./MainComponents/MainTimerColumn";
// import {
//   BrowserRouter as Router,
//   Link,
//   useLocation
// } from "react-router-dom";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }

import {getUser, getGameStream} from "./BackendFunctions";
import './Main.css';

function Main({user} : any){
  
    const [gameId, setGameId] = useState("");
    const [moves, setMoves] = useState([]);
    const [isWhite, setIsWhite] = useState(false);
    const [currTurn, setCurrTurn] = useState("white");
    const [gameObj, setGameObj] = useState({winner: ""})

    const [gotvalue, setGotvalue] = useState(false);

    const setValues = (stateObj : any) =>{
        
        setMoves(stateObj.moves.split(" "));
        setCurrTurn(stateObj.moves === "" ? "white" : stateObj.moves.split(" ").length % 2 === 0 ? "white" : "black");
        setGameObj(stateObj);
        setGotvalue(true);
    }


    const onIdUpdate = (id : string) =>{
        setGameId(id);
        getGameStream(id).then(stream =>{
            
            const readStream = () =>{
                stream?.read().then(({done, value}) =>{
                    
                    if (done){
                        stream.releaseLock();
                        return;
                    }

                    var string = new TextDecoder().decode(value);

                    try{
                        var stateObj = JSON.parse(string);
                        if (!stateObj.error){
                            console.log(stateObj);
                            if (stateObj.state){
                                // This means this is the first call to read
                                
                                setIsWhite(stateObj.white.id === user.id);
                                stateObj = stateObj.state;
                            }
                            
                            setValues(stateObj);
                        }
                        else{
                            console.log("ERROR", stateObj.error);
                            
                        }
                    }
                    catch (e){
                        console.log("No input");
                    }
                    readStream();
                })
            }

            readStream();
        });
    }



    return(
        <div className={"mainDiv"}>
            <div className={"header"}>
            <MainHeader setId={onIdUpdate} gameObj={gameObj}></MainHeader>
            </div>


            <div className={"row"}>
                {gotvalue ?
                    <>
                    <div className={"column left"}>
                        <TimerColumn gameObj={gameObj} isWhite={isWhite} currTurn={currTurn}></TimerColumn>
                    </div>

                    <div className={"column middle"}>
                        {gameId !== "" ? <MoveCard gameObj={gameObj} gameId={gameId} currTurn={currTurn} isWhite={isWhite} moves={moves} winner={gameObj.winner}/> : <></>}
                    </div>

                    {/* Have Last Move & possiblity to draw & possibility to resign in this column */}
                    <div className={"column right"}>
                    </div>
                    </> 
                    : <></>}

            </div>

        </div>
    )
}

export default Main