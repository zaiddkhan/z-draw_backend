import { z } from 'zod';
export var SupportedMessage;
(function (SupportedMessage) {
    SupportedMessage["JoinRoom"] = "JOIN_ROOM";
    SupportedMessage["CoOrdPlot"] = "CO-ORD_PLOT";
})(SupportedMessage || (SupportedMessage = {}));
export const CoordPlotMessage = z.object({
    x: z.number(),
    y: z.number(),
    userId: z.string(),
    roomId: z.string()
});
export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string(),
    totalChances: z.number()
});
