import express, { Application } from 'express';
import dotenv from 'dotenv';

dotenv.config();    
const port = process.env.PORT || 3000;

const app : Application = express();



app.get('/',(req,res) => {
    console.log("app is listeneing")
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});