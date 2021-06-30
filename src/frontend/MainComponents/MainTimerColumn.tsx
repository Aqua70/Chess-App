

import React, { useEffect, useState, useRef } from "react";


import {getUser, makeMove} from "../BackendFunctions"


const NO_TIME_LIMIT = 2147483647;  
const TIME_INTERVAL = 100;

function TimerColumn({gameObj, isWhite, currTurn} : any){

    const [wTime, setWTime] = useState(0);
    const [bTime, setBTime] = useState(0);
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function interval(this: any, duration : number){
        var _this = this
        this.baseline = undefined
        
        this.run = function(wTime : number, bTime : number){
            if(_this.baseline === undefined){
                _this.baseline = new Date().getTime()
            }
            if (gameObj.moves === undefined){
                return
            }
        
            if (gameObj.moves.length < 8){
                return
            }
        
            if (currTurn === "white"){
                setWTime(wTime -TIME_INTERVAL);
            }
            else{
                setBTime(bTime - TIME_INTERVAL);
            }
            var end = new Date().getTime()
            _this.baseline += duration
        
            var nextTick = duration - (end - _this.baseline)
            if(nextTick<0){
                nextTick = 0
            }
            
            _this.timer = setTimeout(function(){
                _this.run(wTime - TIME_INTERVAL, bTime - TIME_INTERVAL)
            }, nextTick)
        }
      
        this.stop = function(){
          clearTimeout(_this.timer)
        }
    }
    
    

    useEffect(()=>{
        setWTime(gameObj.wtime);
        setBTime(gameObj.btime);
        
        const timer = new (interval as any)(TIME_INTERVAL);
        timer.run(gameObj.wtime, gameObj.btime)
        return timer.stop
    }, [gameObj])






    function formatTimeLeft(time : number) {
        // The largest round integer less than or equal to the result of time divided being by 60.
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
        <div>
            {JSON.stringify(gameObj)}
            <br></br>
            {wTime}
            <br></br>
            {bTime}
        </div>
    )
}

export default TimerColumn