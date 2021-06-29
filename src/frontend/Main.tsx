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

const NO_TIME_LIMIT = 2147483647;  

function Main({user} : any){
  
    const [gameId, setGameId] = useState("");
    const [moves, setMoves] = useState([]);
    const [whiteTime, setWhiteTime] = useState(NO_TIME_LIMIT);
    const [blackTime, setBlackTime] = useState(NO_TIME_LIMIT);
    const [isWhite, setIsWhite] = useState(false);
    const [currTurn, setCurrTurn] = useState("white");
    const [gameObj, setGameObj] = useState({})

    const setValues = (stateObj : any) =>{
        
        setMoves(stateObj.moves.split(" "));
        setWhiteTime(stateObj.wtime);
        setBlackTime(stateObj.btime);
        setCurrTurn(stateObj.moves === "" ? "white" : stateObj.moves.split(" ").length % 2 === 0 ? "white" : "black");
        setGameObj(stateObj);
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

                {/* Have Timers in this column */}
                <div className={"column left"}>
                    <TimerColumn></TimerColumn>
                </div>

                <div className={"column middle"}>
                    {gameId !== "" ? <MoveCard gameId={gameId} currTurn={currTurn} isWhite={isWhite} moves={moves} winner={gameObj.winner}/> : <></>}
                </div>

                {/* Have Last Move & possiblity to draw & possibility to resign in this column */}
                <div className={"column right"}>

                </div>


            </div>

        </div>
    )
}

export default Main