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
        const game = await GAME.findOne().sort({ currentRound: 1 }).exec();

        let minCurrentRound: number;
        if (game !== null) {
        minCurrentRound = game.currentRound;
        } else {
        minCurrentRound = 1;
        }

        for (let user of room.users) {
            if (user.currentRound < minCurrentRound) {
                minCurrentRound = user.currentRound;
            }
        }
        if(similarity === 100){
            const maxCurrentRoundGame = await GAME.findOne().sort({ currentRound: -1 }).exec();

            let maxCurrentRound: number;
            if (maxCurrentRoundGame !== null) {
                maxCurrentRound = maxCurrentRoundGame.currentRound;
            } else {
                maxCurrentRound = 1;
            }
    
        
            for(let i = 0;i < room.users.length ;i++ ){
            
                room.users[i] ={ 
                    ...room.users[i],
                    "currentRound" : maxCurrentRound+1
                }
            }
            const game = await GAME.findOne({ 
                "roomId" : roomId
            });
            if(game == null){
                return
            }
            const currentUserPoints =game.points.get(userId) || 0;
            game.points.set(userId, currentUserPoints + 10);
            await game.save();


            console.log("saved the points")
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

              
            console.log(room.users.length)
             room.users.forEach(({name,id,connection}) => {  
                console.log("inside the for loop")
                connection.send(JSON.stringify(correctGuessResponse))
           })
            

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
        const game  = await GAME.findOne({
            roomId : roomId
        })
    
        if(game === null){
            this.rooms.set(roomId,{
                users : [],
                word : randomGuessWord,
            })
            const gameObject = {
                roomId : roomId,
                points : {
                    [userId] : 0
                },
                guessWord : JSON.stringify(randomGuessWord),
                totalRounds : totalChances,
                currentRound : 1,
                players : [userId]
            }
            await GAME.create(gameObject)
            connection.send(JSON.stringify(gameObject))

        }else{

        
            if(game === null){
                return;
            }
             game.players.push(userId)
             game.points.set(userId ,0 )
             await game.save()
        
             connection.send(JSON.stringify(game))


        }
            
    
        
        
        
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