
import React, { useState } from 'react'


export interface AuthorizationType {
  auth : boolean,
  setAuth : React.Dispatch<React.SetStateAction<boolean>>
}

const Authenticated : React.Context<AuthorizationType> = React.createContext({} as AuthorizationType);



export default Authenticated