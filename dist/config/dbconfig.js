import mongoose from "mongoose";
const connectDB = (url) => {
    mongoose.connect('mongodb+srv://zaiddkhhan:zaidkhan7860@cluster0.92tonye.mongodb.net/z-draw');
};
export default connectDB;
