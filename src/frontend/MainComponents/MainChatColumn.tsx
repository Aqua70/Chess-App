import React, {useState } from "react";
import { useEffect } from "react";

import "./MainChatColumn.css"


interface messageObj {
    text : string,
    username : string
}

function MessagePanel({messages} : any){
    return(
        <>

                {
                
                messages.map((item : messageObj, index : number) =>{
                    
                    if (item.username === "lichess"){
                        return (
                            <div key={index} className={"chatMessage center"}>
                                <i>{item.text}</i>
                            </div>
                        );
                    }
                    return (
                        <div key={index} className={"chatMessage"}>
                            <b>{item.username}</b>: {item.text}
                        </div>
                    );
                })
                
                }
        </>
    )
}

function ChatCard({gameId, chatObj, loading} : any){
    
    const [messages, setMessages] = useState([] as messageObj[]);
    const [pastId, setPastId] = useState("");

    useEffect(() =>{
        if (chatObj.room !== "player"){
            return
        }
        
        if (pastId !== gameId){
            console.log("ASD");
            
            setMessages([]);
        }
        else{
            setMessages([...messages, {text : chatObj.text, username : chatObj.username}]);
        }

    }, [chatObj, gameId]);

    useEffect(() =>{
        setPastId(gameId);
    }, [gameId])
    

    const sendMessage = async (e : React.KeyboardEvent<HTMLTextAreaElement>) : Promise<void> => {
        if(e.repeat) return;
        if (e.key === "Enter"){
            e.preventDefault();

            // SEND MESSAGE TO SERVER


            (document.querySelector(".submitMessageArea") as HTMLTextAreaElement).value = "";
        }
        
        
    }


    return(
        <div className={"chatCard"}>
            <h1>
                Chat
            </h1>
            <div className={"messageViewer"}>
                <MessagePanel messages={messages}></MessagePanel>
            </div>
            {/* <div style={{height:"10%"} as React.CSSProperties}></div> */}

            <textarea className={"submitMessageArea"} onKeyDown={(e) => sendMessage(e)} placeholder={"Enter your message"}/>

        </div>
    )
}

export default ChatCard