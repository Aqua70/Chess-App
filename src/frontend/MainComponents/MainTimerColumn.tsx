

import React, { useEffect, useState, useRef } from "react";
import { moveSyntheticComments } from "typescript";


import {getUser, makeMove} from "../BackendFunctions"

import "./MainTimerColumn.css";
import StatusButtons from "./StatusButtons";


const NO_TIME_LIMIT = 2147483647;  
const TIME_INTERVAL = 100;

function Timer({color, isCurr, time} : any){

    function formatTimeLeft(time : number) {
        // The largest round integer less than or equal to the result of time divided being by 60.
        if (time === NO_TIME_LIMIT/1000){
            return "\u221e";
        }
        time = Math.floor(time);

        

        const minutes : number = Math.floor(time / 60);
        
        // Seconds are the remainder of the time divided by 60 (modulus operator)
        let seconds : number = time % 60;
        
        // If the value of seconds is less than 10, then display seconds with a leading zero
        if (seconds < 10) {
          return `${minutes}:0${seconds}`;
        }
      
        // The output in MM:SS format
        return `${minutes}:${seconds}`;
    }

    return(
        <div className={"timerContainer"}>
            <div className={`${color} timer` + (isCurr ? " activeTimer" : "")}>
                {formatTimeLeft(time)}
            </div>
        </div>
    )
}


function TimerColumn({gameObj, isWhite, currTurn} : any){

    const [wTime, setWTime] = useState(0);
    const [bTime, setBTime] = useState(0);
    
    const isTimerActive = () =>{
        return !(gameObj.moves === undefined || gameObj.winner || gameObj.moves.length < 8 || gameObj.status === "aborted" || gameObj.status === "draw");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function interval(this: any, duration : number){
        var _this = this
        this.baseline = undefined
        this.continue = true;
        this.run = function(wTime : number, bTime : number){
            if(_this.baseline === undefined){
                _this.baseline = new Date().getTime()
            }
            if (!isTimerActive() || wTime === NO_TIME_LIMIT){
                return
            }
            
        
            if (currTurn === "white" && wTime !== NO_TIME_LIMIT){
                setWTime(wTime -TIME_INTERVAL);
            }
            else if (bTime !== NO_TIME_LIMIT){
                setBTime(bTime - TIME_INTERVAL);
            }
            var end = new Date().getTime()
            _this.baseline += duration
        
            var nextTick = duration - (end - _this.baseline)
            if(nextTick<0){
                nextTick = 0
            }
            _this.timer = setTimeout(function(){
                if (_this.continue)
                    _this.run(wTime - TIME_INTERVAL, bTime - TIME_INTERVAL)
            }, nextTick)
        }
      
        this.stop = function(){
          clearTimeout(_this.timer)
          _this.continue = false;
        }
    }
    

    useEffect(()=>{

        setWTime(gameObj.wtime);
        setBTime(gameObj.btime);
        
        const timer = new (interval as any)(TIME_INTERVAL);
        timer.run(gameObj.wtime, gameObj.btime)
        return () =>{
            timer.stop()
        };
    }, [gameObj])


    const getIsCurrMyClock = () =>{
        if (!isTimerActive()){
            return 0;
        }
        return !isWhite && currTurn === "black" || isWhite && currTurn === "white"
    }

    const getIsCurrTheirClock = () =>{
        if (!isTimerActive()){
            return 0;
        }
        return !getIsCurrMyClock();
    }


    return(
        <div style={{height:"100%", width: "100%", boxsizing: "border-box"} as React.CSSProperties}>

            <div style={{height:"10%"} as React.CSSProperties}>
            </div>

            <Timer color={isWhite ? "black" : "white"} time={isWhite ? bTime/1000 : wTime/1000} isCurr={getIsCurrTheirClock()}></Timer>

            <div style={{height:"45%"} as React.CSSProperties}>
                <StatusButtons></StatusButtons>
            </div>

            <Timer color={isWhite ? "white" : "black"} time={isWhite ? wTime/1000 : bTime/1000} isCurr={getIsCurrMyClock()}></Timer>
            
        </div>
    )
}

export default TimerColumn