import { z} from 'zod';


export enum SupportedOutgoingMessage {
    SEND_COORDS = "SEND_COORDS"
}

type OutgoingCoords = {
    roomId : string,
    x : number,
    y : number,
    userId : string
}

export type OutgoingMessage  = {
    type : SupportedOutgoingMessage.SEND_COORDS,
    payload : OutgoingCoords
}