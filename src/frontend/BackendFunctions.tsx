import axios from 'axios'

const APIpath = "";

const getAuthLink = async () =>{
    const authObject = await axios.get("/auth");
    return authObject.data.link;
}

const getUser = async () : Promise<Object> => {
    const userObject = await axios.get("/user")
    return userObject.data
}

const getGameStream = async (id : string) : Promise<ReadableStreamDefaultReader<any> | undefined> =>{
    
    return fetch(`${APIpath}/gameStream/${id}`).then(res => {
        // TODO: throw error on res.body is undefined
        
        return res.body?.getReader()
    });
}

const makeMove = async (move : string, gameId : string) =>{
    const outcome = await axios.post(`${APIpath}/makeMove`, {move, id : gameId});
    return outcome.data;
}


const abort = async (id : string) : Promise<Object> => {
    const outcome = await axios.post(`${APIpath}/abort/${id}`);
    return outcome.data;
}

const draw = async (id : string, accept: string) : Promise<Object> => {
    const outcome = await axios.post(`${APIpath}/draw/${id}/${accept}`);
    return outcome.data;
}

const resign = async (id : string) : Promise<Object> => {
    const outcome = await axios.post(`${APIpath}/resign/${id}`);
    return outcome.data;
}

const message = async (id : string, message : string) : Promise<Object> =>{
    const outcome = await axios.post(`${APIpath}/message/${id}`, {message});
    return outcome.data;
}



export {getAuthLink, getUser, getGameStream, makeMove, abort, draw, resign, message}