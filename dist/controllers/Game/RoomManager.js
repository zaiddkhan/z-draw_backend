import generateRandomWord from "./index.js";
import { GAME } from "../../models/GameSchema.js";
export class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    async addUser(name, userId, roomId, connection, totalChances) {
        const randomGuessWord = generateRandomWord();
        if (!this.rooms.get(roomId)) {
            this.rooms.set(roomId, {
                users: [],
                word: randomGuessWord,
                totalChances: totalChances
            });
        }
        this.rooms.get(roomId)?.users.push({
            id: userId,
            name,
            connection
        });
        const gameObject = {
            userId: userId,
            roomId: roomId,
            currentChance: 1,
            totalChances: totalChances,
            points: 0,
            guessWord: JSON.stringify(randomGuessWord)
        };
        await GAME.create(gameObject);
        connection.send(JSON.stringify(gameObject));
        connection.on('close', (reasonCode, desc) => {
            //remove
        });
    }
    broadcastCoordinates(userId, roomId, outgoingCoords) {
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
