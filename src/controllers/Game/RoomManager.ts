import { WebSocket } from "ws";
import { OutgoingMessage, SupportedOutgoingMessage } from "./outgoingMessages.js";
import  { OutgoingGuessWord, findSimilarity } from "./helper.js";
import { generateRandomWord } from "./helper.js";
import { GAME } from "../../models/GameSchema.js";
import { ROOM } from "../../models/RoomSchema.js";

interface User{
    name : String,
    id : String,
    connection : WebSocket,
    currentRound : number
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


    async guessWords(userId : string,roomId : string,guessedWord : string,currentWord : string){

        const room = this.rooms.get(roomId);
        if(room == null){
            return
        }
        const similarity = findSimilarity(guessedWord,currentWord)
        let minCurrentRound = room.users[0].currentRound;
        for (let user of room.users) {
            if (user.currentRound < minCurrentRound) {
                minCurrentRound = user.currentRound;
            }
        }
        if(similarity === 100){
            let maxCurrentRound = room.users[0].currentRound;
            for (let user of room.users) {
                if (user.currentRound > maxCurrentRound) {
                    maxCurrentRound = user.currentRound;
                }
            }
            for(let i = 0;i < room.users.length ;i++ ){
            
                room.users[i] ={ 
                    ...room.users[i],
                    "currentRound" : maxCurrentRound+1
                }
            }
           
             const randomGuessWord = generateRandomWord()
             const correctGuessResponse : OutgoingMessage = {
                    type : SupportedOutgoingMessage.GUESS_RESULT,
                    payload : {
                        word : randomGuessWord.word,
                        similarity : similarity,
                        currentRound : maxCurrentRound+1,
                        isEnded : false
                    }
                }
                room.users.forEach(({name,id,connection}) => {  connection.send(JSON.stringify(correctGuessResponse))   })
            

        }else{
       


        const guessWordResponse : OutgoingMessage = {
            type : SupportedOutgoingMessage.GUESS_RESULT,
            payload : {
                word : currentWord,
                similarity : similarity,
                currentRound : room.users[0].currentRound,
                isEnded : false
            }
        }
        room.users.forEach(({name,id,connection}) => {
            connection.send(JSON.stringify(guessWordResponse))
        })
    }
        
    
    }

    

    async addUser(name : string,userId : string,roomId : string,connection : WebSocket,totalChances : number){

       
        const randomGuessWord = generateRandomWord()
        
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId,{
                users : [],
                word : randomGuessWord,
            })
        }
       
        this.rooms.get(roomId)?.users.push({
            id : userId,
            name : name,
            connection :connection,
            currentRound : 1
        });

        const gameObject = {
            userId : userId,
            roomId : roomId,
            points : 0,
            guessWord : JSON.stringify(randomGuessWord),
            totalChances : totalChances
        }
        await GAME.create(gameObject)
        
        
        connection.send(JSON.stringify(gameObject))
        
        
        connection.on('close',(reasonCode,desc) => {
            //remove
        })
    }
    

    broadcastCoordinates(userId : string,roomId : string,outgoingCoords : OutgoingMessage){
        const room = this.rooms.get(roomId)
        if(room == null){
            return
        } 
        room.users.forEach(({name,id,connection}) => {
           if(id == userId){
               return
           }

        connection.send(JSON.stringify(outgoingCoords))
        })

    }
}