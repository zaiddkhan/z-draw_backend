import { SupportedMessage } from "./IncomingMessages.js";
import { RoomManager } from "./RoomManager.js";
import { SupportedOutgoingMessage } from "./outgoingMessages.js";
const roomManager = new RoomManager();
function messageHandler(ws, message) {
    if (message.type == SupportedMessage.JoinRoom) {
        const payload = message.payload;
        roomManager.addUser(payload.name, payload.userId, payload.roomId, ws, payload.totalChances);
    }
    else if (message.type == SupportedMessage.CoOrdPlot) {
        const payload = message.payload;
        const outgoingCoords = {
            type: SupportedOutgoingMessage.SEND_COORDS,
            payload: {
                roomId: payload.roomId,
                x: payload.x,
                y: payload.y,
                userId: payload.userId
            }
        };
        roomManager.broadcastCoordinates(payload.userId, payload.roomId, outgoingCoords);
    }
}
export default messageHandler;
