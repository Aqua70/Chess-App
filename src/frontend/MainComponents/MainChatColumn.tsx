import React, {useState } from "react";
import { useEffect } from "react";
import {message} from "../BackendFunctions";

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

function ChatCard({gameId, chatObj} : any){
    
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
            const textArea = document.querySelector(".submitMessageArea") as HTMLTextAreaElement
            if (textArea.value === ""){
                return;
            }
            // SEND MESSAGE TO SERVER
            textArea.disabled = true;
            const success = await message(gameId, textArea.value);
            

            textArea.value = "";
            textArea.disabled = false;
            textArea.focus();
        }
        
        
    }


    return(
        <div className={"chatCard"}>
            <h1 className={"chat"}>
                Chat
            </h1>
            <div className={"messageViewer"}>
                <MessagePanel messages={messages}></MessagePanel>
            </div>
            {/* <div style={{height:"10%"} as React.CSSProperties}></div> */}

            <textarea className={"submitMessageArea"} onKeyDown={(e) => sendMessage(e)} placeholder={"Enter your message. Don't spam or repeat your last message"}/>

        </div>
    )
}

export default ChatCard