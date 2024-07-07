import { WebSocket } from "ws";
import { OutgoingMessage, SupportedOutgoingMessage } from "./outgoingMessages.js";
import  { OutgoingGuessWord, findSimilarity } from "./helper.js";
import { generateRandomWord } from "./helper.js";
import { GAME } from "../../models/GameSchema.js";
import { ROOM } from "../../models/RoomSchema.js";
import { shortenHiddenIndices } from "./helper.js";

interface User{
    id : String,
    connection : WebSocket,
}



interface Room {
    roomId : String,
    users : User[],
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
        const game = await GAME.findOne(
           { 'roomId' : roomId }
        ).sort({ currentRound: 1 }).exec();

        let minCurrentRound: number;
        if (game !== null) {
        minCurrentRound = game.currentRound;
        } else {
        minCurrentRound = 1;
        }

      
        if(similarity === 100){
            const maxCurrentRoundGame = await GAME.findOne().sort({ currentRound: -1 }).exec();

            let maxCurrentRound: number;
            if (maxCurrentRoundGame !== null) {
                maxCurrentRound = maxCurrentRoundGame.currentRound;
            } else {
                maxCurrentRound = 1;
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
              this.rooms.get(roomId)?.users.forEach((user) => {
                user.connection.send(JSON.stringify(correctGuessResponse))
              })
                      

        }
        else{
       


        const guessWordResponse : OutgoingMessage = {
            type : SupportedOutgoingMessage.GUESS_RESULT,
            payload : {
                word : currentWord,
                similarity : similarity,
                currentRound : minCurrentRound,
                isEnded : false
            }
        }
        console.log(this.rooms.get(roomId)?.users)
        this.rooms.get(roomId)?.users.forEach((user) => {
            user.connection.send(JSON.stringify(guessWordResponse))
        })
    
    }
        
    
    }


    async unhideLetters(roomId : string){
        const game = await GAME.findOne(
           { 'roomId' : roomId}
        )
        if(game == null){
        
            return
        }
        const openIndexes = game.guessWord.indexes
        const word = game.guessWord.word
        const numberOfHiddenLetters = word.length - openIndexes.length
        if(numberOfHiddenLetters == 0){
            return
        }
        const indices = [];
        for (let i = 0; i < word.length; i++) {
            indices.push(i);
        }
        const remainingIndices = indices.filter( num =>
           !openIndexes.includes(num)
        )
        const  newIndices = shortenHiddenIndices(remainingIndices,remainingIndices.length/2)
        await newIndices.forEach((num) => {
            game.guessWord.indexes.push(num)
        })
        await game.save()
        this.rooms.get(roomId)?.users.forEach((user) => {
            user.connection.send(
                JSON.stringify( newIndices.concat(openIndexes).sort())
            )
        }
        )
       
        
    }
    

    async addUser(name : string,userId : string,roomId : string,connection : WebSocket){

        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, { roomId, users: [
                {
                    id  : userId,
                    connection : connection
                }
            ] });
        }else{
            if(this.rooms.get(roomId) !== null){

               this.rooms.get(roomId)!!.users.push({ id: userId, connection: connection });
            }
        }
       
        const game  = await GAME.findOne({
            roomId : roomId
        })
    
        if(game === null){
            return
        }else{

            if(game.players.includes(userId)){
                return
            }

        
             game.points.set(userId ,0 )
             game.players.push(userId)
            
            
           
            await game.save()
            console.log(game.players.length)
             console.log(game.maxPlayers)
             if(game.players.length == game.maxPlayers){
                game.currentPaintr = userId
                this.rooms.get(roomId)?.users.forEach((user) => {
                    user.connection.send(JSON.stringify({
                        currentPlayer : userId,
                        playerAdded : true
                    })
                )})
             }else{
             this.rooms.get(roomId)?.users.forEach((user) => {
                user.connection.send(JSON.stringify({
                    currentPlayer : '',
                    playerAdded : true
                })
            )})
        }
       
        
            


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
        room.users.forEach((user) => {
           if(user.id == userId){
               return
           }

        user.connection.send(JSON.stringify(outgoingCoords))
        })

    }
}