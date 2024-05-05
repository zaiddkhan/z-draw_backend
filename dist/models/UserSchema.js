import { Schema, model } from "mongoose";
const userSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    },
    favorite_food: {
        type: String,
        required: true
    },
    hobby: {
        type: String,
        required: true
    }
});
export const USER = model("USER", userSchema);
