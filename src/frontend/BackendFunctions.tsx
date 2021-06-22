import axios from 'axios'


const getAuthLink = async () =>{
    const authObject = await axios.get("/auth");
    return authObject.data.link;
}

const getUser = async () : Promise<Object> => {
    const userObject = await axios.get("/user")
    return userObject.data
}

const getGameStream = async (id : string) : Promise<Object> =>{
    console.log(id);
    
    const stream : any = (await axios.get(`/gameStream/${id}`)).data;

    // stream.on("data", () => {
    //     console.log("ASD");
        
    // })
    console.log(id);
    
    return stream;
}






export {getAuthLink, getUser, getGameStream}