import { SupportedOutgoingMessage } from "./outgoingMessages.js";
import { findSimilarity } from "./helper.js";
import { generateRandomWord } from "./helper.js";
import { GAME } from "../../models/GameSchema.js";
import { shortenHiddenIndices } from "./helper.js";
export class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    async guessWords(userId, roomId, guessedWord, currentWord) {
        const room = this.rooms.get(roomId);
        if (room == null) {
            return;
        }
        const similarity = findSimilarity(guessedWord, currentWord);
        const game = await GAME.findOne({ 'roomId': roomId }).sort({ currentRound: 1 }).exec();
        let minCurrentRound;
        if (game !== null) {
            minCurrentRound = game.currentRound;
        }
        else {
            minCurrentRound = 1;
        }
        if (similarity === 100) {
            const maxCurrentRoundGame = await GAME.findOne().sort({ currentRound: -1 }).exec();
            let maxCurrentRound;
            if (maxCurrentRoundGame !== null) {
                maxCurrentRound = maxCurrentRoundGame.currentRound;
            }
            else {
                maxCurrentRound = 1;
            }
            const game = await GAME.findOne({
                "roomId": roomId
            });
            if (game == null) {
                return;
            }
            const currentUserPoints = game.points.get(userId) || 0;
            game.points.set(userId, currentUserPoints + 10);
            await game.save();
            const randomGuessWord = generateRandomWord();
            const correctGuessResponse = {
                type: SupportedOutgoingMessage.GUESS_RESULT,
                payload: {
                    word: randomGuessWord.word,
                    similarity: similarity,
                    currentRound: maxCurrentRound + 1,
                    isEnded: false
                }
            };
            this.rooms.get(roomId)?.users.forEach((user) => {
                user.connection.send(JSON.stringify(correctGuessResponse));
            });
        }
        else {
            const guessWordResponse = {
                type: SupportedOutgoingMessage.GUESS_RESULT,
                payload: {
                    word: currentWord,
                    similarity: similarity,
                    currentRound: minCurrentRound,
                    isEnded: false
                }
            };
            this.rooms.get(roomId)?.users.forEach((user) => {
                user.connection.send(JSON.stringify(guessWordResponse));
            });
        }
    }
    async unhideLetters(roomId) {
        const game = await GAME.findOne({ 'roomId': roomId });
        if (game == null) {
            return;
        }
        const openIndexes = game.guessWord.indexes;
        const word = game.guessWord.word;
        const numberOfHiddenLetters = word.length - openIndexes.length;
        if (numberOfHiddenLetters == 0) {
            return;
        }
        const indices = [];
        for (let i = 0; i < word.length; i++) {
            indices.push(i);
        }
        const remainingIndices = indices.filter(num => !openIndexes.includes(num));
        const newIndices = shortenHiddenIndices(remainingIndices, remainingIndices.length / 2);
        await newIndices.forEach((num) => {
            game.guessWord.indexes.push(num);
        });
        await game.save();
        this.rooms.get(roomId)?.users.forEach((user) => {
            user.connection.send(JSON.stringify(newIndices.concat(openIndexes).sort()));
        });
    }
    async addUser(name, userId, roomId, connection) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, { roomId, users: [
                    {
                        id: userId,
                        connection: connection
                    }
                ] });
        }
        else {
            if (this.rooms.get(roomId) !== null) {
                this.rooms.get(roomId).users.push({ id: userId, connection: connection });
            }
        }
        const game = await GAME.findOne({
            roomId: roomId
        });
        if (game === null) {
            return;
        }
        else {
            if (game.players.includes(userId)) {
                return;
            }
            game.points.set(userId, 0);
            game.players.push(userId);
            await game.save();
            console.log(game.players.length);
            console.log(game.maxPlayers);
            if (game.players.length == game.maxPlayers) {
                game.currentPaintr = userId;
                this.rooms.get(roomId)?.users.forEach((user) => {
                    user.connection.send(JSON.stringify({
                        currentPlayer: userId,
                        playerAdded: true
                    }));
                });
            }
            else {
                this.rooms.get(roomId)?.users.forEach((user) => {
                    user.connection.send(JSON.stringify({
                        currentPlayer: '',
                        playerAdded: true
                    }));
                });
            }
        }
        connection.on('close', (reasonCode, desc) => {
            //remove
        });
    }
    broadcastCoordinates(userId, roomId, outgoingCoords) {
        const room = this.rooms.get(roomId);
        if (room == null) {
            return;
        }
        room.users.forEach((user) => {
            if (user.id == userId) {
                return;
            }
            user.connection.send(JSON.stringify(outgoingCoords));
        });
    }
}
