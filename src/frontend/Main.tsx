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

import {getUser} from "./BackendFunctions"

function Temp(props : any){
  
    const [id, setId] = useState("");




    return(
        <div>
            <MainHeader setId={setId}></MainHeader>
            {id}
        </div>
    )
}

export default Temp