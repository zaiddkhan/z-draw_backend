import { Schema, model } from 'mongoose';
const roomSchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    max_players: {
        type: Number,
        default: 0,
        required: true,
    },
    start_time: {
        type: Number,
        default: Date.now
    },
    host_id: {
        type: String,
        required: true
    },
    joined_by: {
        type: [String],
        required: true
    },
    expiry_time: {
        type: Number
    },
    rounds: {
        type: Number,
        default: 5
    }
});
export const ROOM = model("ROOM", roomSchema);
