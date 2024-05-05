import mongoose from "mongoose";

const connectDB = (url : any) => {
    mongoose.connect('mongodb+srv://zaiddkhhan:zaidkhan7860@cluster0.92tonye.mongodb.net/z-draw');
}

export default connectDB