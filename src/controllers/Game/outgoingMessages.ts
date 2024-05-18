import { z} from 'zod';


export enum SupportedOutgoingMessage {
    SEND_COORDS = "SEND_COORDS",
    GUESS_RESULT = "GUESS_RESULT"
}

type OutgoingCoords = {
    roomId : string,
    x : number,
    y : number,
    userId : string
}

type OutgoingWordGuessResult = {
    similarity : number,
    currentRound : number,
    isEnded : boolean
}

export type OutgoingMessage  = {
    type : SupportedOutgoingMessage.SEND_COORDS,
    payload : OutgoingCoords
} | {
    type : SupportedOutgoingMessage.GUESS_RESULT,
    payload : OutgoingWordGuessResult
}