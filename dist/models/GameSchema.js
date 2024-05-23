import { Schema, model } from 'mongoose';
const gameSchema = new Schema({
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
        type: String,
        required: true
    },
    players: {
        type: [String],
        required: true
    }
});
export const GAME = model("GAME", gameSchema);
