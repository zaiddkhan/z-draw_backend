import express, { Application } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/UserRoutes.js';
import connectDB from './config/dbconfig.js';
import bodyParser from 'body-parser';
import roomRouter from './routes/RoomRoutes.js';


dotenv.config();    
const port = process.env.PORT || 3000;

const app : Application = express();

app.use(express.json());



app.use(bodyParser.json());  // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/v1/user',userRouter)
app.use('/v1/room',roomRouter)

app.get('/',(req,res) => {
    console.log("app is listeneing")
})

const startDB = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Mongodb is connected!!!')
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
}

startDB();