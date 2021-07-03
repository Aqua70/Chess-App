

import React, { useEffect, useState, useRef } from "react";
import { moveSyntheticComments } from "typescript";


import {getUser, makeMove} from "../BackendFunctions"




import abort from './icons/abortIcon.png';
import draw from './icons/drawIcon.png';
import resign from './icons/resignIcon.png';

import "./StatusButtons.css";

function StatusButtons({color, isCurr, time} : any){


    return(
        <div>
            <button className="statusButton">
                <img className="statusButton" src={abort}></img>
            </button>
            <button className="statusButton">
                <img className="statusButton" src={draw}></img>
            </button>
            <button className="statusButton">
                <img className="statusButton" src={resign}></img>
            </button>
            
        </div>
    )
}

export default StatusButtons