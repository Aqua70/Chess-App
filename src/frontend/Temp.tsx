import React, { useEffect, useState } from "react";
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
    
    const [user, setUser] = useState("");

    useEffect( () =>{
        getUser().then((u) => {
            
            setUser(JSON.stringify(u))
        })
    });

    return(
        <div>
            {user}
        </div>
    )
}

export default Temp