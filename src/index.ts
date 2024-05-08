import express, { Application } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/UserRoutes.js';
import connectDB from './config/dbconfig.js';
import bodyParser from 'body-parser';
import roomRouter from './routes/RoomRoutes.js';
import { WebSocketServer,WebSocket } from 'ws'
import messageHandler from './controllers/Game/messageHandler.js';





dotenv.config();    
const port = process.env.PORT || 3000;

const app : Application = express();

app.use(express.json());



app.use(bodyParser.json());  // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/v1/user',userRouter)
app.use('/v1/room',roomRouter)

const startDB = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Mongodb is connected!!!')
        
    } catch (error) {
        console.log(error);
    }
}

startDB();


let httpServer = app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});

const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  
  ws.on('message', function message(data, isBinary) {
    console.log(data.toString());
    console.log(JSON.parse(data.toString()).payload);
    if (data) {
        try {
            messageHandler(ws, JSON.parse(data.toString()));
        } catch(e) {

        }
    }
  });

  ws.send('Hello! Message From Server!!');
});






