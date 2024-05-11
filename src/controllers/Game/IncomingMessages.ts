import exp from 'constants';
import { z} from 'zod';


export enum SupportedMessage {
    JoinRoom =  "JOIN_ROOM",
    CoOrdPlot = "CO-ORD_PLOT"
}

export type IncomingMessage = {
    type: SupportedMessage.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessage.CoOrdPlot,
    payload: CoordPlotMessageType
}

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
