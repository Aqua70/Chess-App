import React, { useState } from "react";
import MainHeader from "./MainComponents/MainHeader"
import MoveCard from "./MainComponents/MainMoveCard";
import TimerColumn from "./MainComponents/MainTimerColumn";
import Loader from "react-loader-spinner";
import ChatCard from "./MainComponents/MainChatColumn";

import {getGameStream} from "./BackendFunctions";
import './Main.css';

function Main({user} : any){
    
    const [gameId, setGameId] = useState("");
    const [moves, setMoves] = useState([]);
    const [isWhite, setIsWhite] = useState(false);
    const [currTurn, setCurrTurn] = useState("white");
    const [gameObj, setGameObj] = useState({winner: ""})
    const [loading, setLoading] = useState(false);
    const [chatObj, setChatObj] = useState({});

    const [gotvalue, setGotvalue] = useState(false);

    const setValues = (stateObj : any) =>{
        
        setMoves(stateObj.moves.split(" "));
        setCurrTurn(stateObj.moves === "" ? "white" : stateObj.moves.split(" ").length % 2 === 0 ? "white" : "black");
        setGameObj(stateObj);
        setGotvalue(true);
    }


    const onIdUpdate = (id : string) =>{
        setGameId(id);
        setLoading(true);
        getGameStream(id).then(stream =>{
            
            const readStream = () =>{
                stream?.read().then(({done, value}) =>{
                    
                    var string = new TextDecoder().decode(value);
                    
                    const jsons = string.split("\n");
                    console.log(jsons);
                    
                    jsons.forEach((json) =>{

                        try{
                            var stateObj = JSON.parse(json);
                            console.log(stateObj);
                            
                            if (!stateObj.error){
                                if (stateObj.type === "gameFull"){
                                    // This means this is the first call to read
                                    
                                    setIsWhite(stateObj.white.id === user.id);
                                    stateObj = stateObj.state;
                                    setValues(stateObj);
                                }
                                else if (stateObj.type === "gameState"){
                                    setValues(stateObj);
                                }
                                else if (stateObj.type === "chatLine"){
                                    setChatObj(stateObj);
                                }
                                
                                
                            }
                            else{
                                console.log("ERROR", stateObj.error);
                            }

                        }
                        catch (e){
                        }

                    })
                    

                    if (done){
                        stream.releaseLock();
                        return;
                    }
                    readStream();
                })
            }
            setLoading(false);
            readStream();
        });
    }



    return(
        <div className={"mainDiv"}>
            <div className={"header"}>
                <MainHeader setId={onIdUpdate} gameObj={gameObj}></MainHeader>
            </div>


            <div className={"row"}>
                {loading ? 
                
                <div className="loaderContainer">
                    <Loader type="ThreeDots" color="dark" height="150px" width="150px"></Loader>
                </div>
                : gotvalue ?
                    <>
                        <div className={"column left"}>
                            <TimerColumn gameId={gameId} gameObj={gameObj} isWhite={isWhite} currTurn={currTurn}></TimerColumn>
                        </div>

                        <div className={"column middle"}>
                            <MoveCard gameObj={gameObj} gameId={gameId} currTurn={currTurn} isWhite={isWhite} moves={moves} winner={gameObj.winner}/>
                        </div>

                        {/* Have Last Move & possiblity to draw & possibility to resign in this column */}
                        <div className={"column right"}>
                            <ChatCard chatObj={chatObj} gameId={gameId}></ChatCard>
                        </div>
                    </> 
                    : <></>}

            </div>

        </div>
    )
}

export default Main