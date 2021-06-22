import React, { useEffect, useState } from "react";
import MainHeader from "./MainHeader"
// import {
//   BrowserRouter as Router,
//   Link,
//   useLocation
// } from "react-router-dom";

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
//   }

import {getUser, getGameStream} from "./BackendFunctions"


function Temp(props : any){
  


    const onIdUpdate = async (id : string) =>{
        const stream = await getGameStream(id);
        console.log(stream);
        

    }



    return(
        <div>
            <MainHeader setId={onIdUpdate}></MainHeader>



        </div>
    )
}

export default Temp