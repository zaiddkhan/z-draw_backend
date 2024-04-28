import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/UserRoutes.js';
import connectDB from './config/dbconfig.js';
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/v1/user', userRouter);
app.get('/', (req, res) => {
    console.log("app is listeneing");
});
const startDB = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Mongodb is connected!!!');
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
startDB();
