import { IncomingMessage, SupportedMessage } from "./IncomingMessages.js";
import { RoomManager } from "./RoomManager.js";
import { WebSocket } from "ws";
import { OutgoingMessage, SupportedOutgoingMessage } from "./outgoingMessages.js";

const roomManager = new RoomManager()
function messageHandler(ws : WebSocket,message : IncomingMessage){
    
    if(message.type == SupportedMessage.JoinRoom){
        const payload = message.payload;
        
        roomManager.addUser(payload.name,payload.userId,payload.roomId,ws)
    }else if(message.type == SupportedMessage.CoOrdPlot){

        const payload = message.payload;

        const outgoingCoords : OutgoingMessage =  {
            type : SupportedOutgoingMessage.SEND_COORDS,
            payload : {
                roomId : payload.roomId,
                x : payload.x,
                y : payload.y,
                userId : payload.userId
            }
        }


        roomManager.broadcastCoordinates(payload.userId,payload.roomId,outgoingCoords)
    
    }else if(message.type == SupportedMessage.WordGuess){
        const payload = message.payload
        roomManager.guessWords(payload.userId,payload.roomId,payload.guessedWord,payload.currentWord)
    }else if(message.type == SupportedMessage.WordTweek){
        const payload = message.payload
        roomManager.unhideLetters(payload.roomId)
    }
}

export default messageHandler