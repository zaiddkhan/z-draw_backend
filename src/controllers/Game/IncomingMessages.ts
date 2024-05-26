import exp from 'constants';
import { z} from 'zod';


export enum SupportedMessage {
    JoinRoom =  "JOIN_ROOM",
    CoOrdPlot = "CO-ORD_PLOT",
    WordGuess = "WORD_GUESS",
    WordTweek = "TWEEK_WORD"
}


export type IncomingMessage = {
    type: SupportedMessage.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessage.CoOrdPlot,
    payload: CoordPlotMessageType
} | {
    type : SupportedMessage.WordGuess,
    payload : GuessWordMessageType
} | {
    type : SupportedMessage.WordTweek,
    payload : WordTweekType
}

 const WordTweek = z.object({
    roomId : z.string()
})
type WordTweekType = z.infer<typeof WordTweek>

export const GuessWordMessage = z.object({
    guessedWord : z.string(),
    currentWord : z.string(),
    userId : z.string(),
    roomId : z.string()
})



export type GuessWordMessageType = z.infer<typeof GuessWordMessage>

export const CoordPlotMessage = z.object({
    x : z.number(),
    y : z.number(),
    userId : z.string(),
    roomId : z.string()
})

export type CoordPlotMessageType = z.infer<typeof CoordPlotMessage>
export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(), 
    roomId: z.string(),
})
    
export type InitMessageType = z.infer<typeof InitMessage>;
