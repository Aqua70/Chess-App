

import React, { useEffect, useState } from "react";


import {getUser, makeMove} from "../BackendFunctions"

function TimerColumn({gameId} : any){
    
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
            {"HELLO"}
        </div>
    )
}

export default TimerColumn