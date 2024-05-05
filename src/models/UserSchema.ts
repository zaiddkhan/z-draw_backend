import { Schema,model } from "mongoose"

interface User {
    nickname : String,
    email : String,
    profile_image : String,
    favorite_food : String,
    hobby : String
}

const userSchema = new Schema<User>({
    nickname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    profile_image : {
        type : String,
        required : true
    },
    favorite_food : {
        type : String,
        required : true
    },
    hobby : {
        type : String,
        required : true
    }
});

export const USER = model<User>("USER",userSchema)