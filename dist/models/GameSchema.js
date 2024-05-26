import { Schema, model } from 'mongoose';
const gameSchema = new Schema({
    currentPaintr: {
        type: String,
        required: false,
        default: ''
    },
    roomId: {
        type: String,
        required: true
    },
    currentRound: {
        type: Number,
        required: true
    },
    totalRounds: {
        type: Number,
        required: true
    },
    points: {
        type: Map,
        of: Number,
        required: true
    },
    guessWord: {
        type: new Schema({
            word: {
                type: String,
                required: true
            },
            indexes: {
                type: [Number],
                required: true,
            },
            length: {
                type: Number,
                required: true
            }
        }),
        required: true
    },
    players: {
        type: [String],
        required: true
    },
    expiryTime: {
        type: Number,
        required: true
    },
    maxPlayers: {
        type: Number,
        required: true
    },
});
export const GAME = model("GAME", gameSchema);
