import { Schema,model } from 'mongoose';
import { number } from 'zod';


interface Game{
    roomId : string,
    currentRound : number,
    totalRounds : number,
    points : Map<string,number>,
    guessWord : string,
    players: string[],
    expiryTime : number,
    maxPlayers : number,
    currentPaintr : string
}


const gameSchema = new Schema<Game>({
   
    currentPaintr : {
        type : String,
        required : true,
        default : ''
    },
    roomId : {
        type : String,
        required : true
    },
    currentRound : {
        type : Number,
        required : true
    },
    totalRounds : {
        type : Number,
        required : true
    },
    points : {
        type : Map,
        of : Number,
        required : true
    },
    guessWord : {
        type : String,
        required : true
    },
    players : {
        type : [String],
        required : true
    },
    expiryTime : {
        type : Number,
        required : true
    },
    maxPlayers : {
        type : Number,
        required : true
    },
   
})

export const GAME = model<Game>("GAME",gameSchema)