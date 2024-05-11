import { WebSocket } from "ws";
import { OutgoingMessage } from "./outgoingMessages.js";
import generateRandomWord, { OutgoingGuessWord } from "./index.js";

interface User{
    name : String,
    id : String,
    connection : WebSocket
}

interface Room {
    users : User[],
    word : OutgoingGuessWord
}

export class RoomManager{
    private rooms :  Map<string,Room>;
    constructor(){
        this.rooms = new Map<string,Room>()
    }

    addUser(name : string,userId : string,roomId : string,connection : WebSocket){

       
        const randomGuessWord = generateRandomWord()
        
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId,{
                users : [],
                word : randomGuessWord
            })
        }
        console.log(randomGuessWord)
        this.rooms.get(roomId)?.users.push({
            id : userId,
            name,
            connection
        });
        
        
        connection.on('close',(reasonCode,desc) => {
            //remove
        })
    }

    broadcast(userId : string,roomId : string,outgoingCoords : OutgoingMessage){
        const room = this.rooms.get(roomId)
        if(room == null){
            return
        } 
        room.users.forEach(({name,id,connection}) => {
           if(id == userId){
               return
           }
           console.log("outgoing message " + JSON.stringify(outgoingCoords))

            connection.send(JSON.stringify(outgoingCoords))
        })

    }
}