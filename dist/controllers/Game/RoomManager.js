import generateRandomWord from "./index.js";
export class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    addUser(name, userId, roomId, connection) {
        const randomGuessWord = generateRandomWord();
        if (!this.rooms.get(roomId)) {
            this.rooms.set(roomId, {
                users: [],
                word: randomGuessWord
            });
        }
        console.log(randomGuessWord);
        this.rooms.get(roomId)?.users.push({
            id: userId,
            name,
            connection
        });
        connection.on('close', (reasonCode, desc) => {
            //remove
        });
    }
    broadcast(userId, roomId, outgoingCoords) {
        const room = this.rooms.get(roomId);
        if (room == null) {
            return;
        }
        room.users.forEach(({ name, id, connection }) => {
            if (id == userId) {
                return;
            }
            console.log("outgoing message " + JSON.stringify(outgoingCoords));
            connection.send(JSON.stringify(outgoingCoords));
        });
    }
}
