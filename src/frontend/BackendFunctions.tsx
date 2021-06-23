import axios from 'axios'
import { PassThrough } from 'stream';


const getAuthLink = async () =>{
    const authObject = await axios.get("/auth");
    return authObject.data.link;
}

const getUser = async () : Promise<Object> => {
    const userObject = await axios.get("/user")
    return userObject.data
}

const getGameStream = async (id : string) : Promise<ReadableStreamDefaultReader<any> | undefined> =>{
    
    return fetch(`/gameStream/${id}`).then(res => {
        // TODO: throw error on res.body is undefined
        return res.body?.getReader()
    });

}






export {getAuthLink, getUser, getGameStream}