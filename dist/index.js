import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/UserRoutes.js';
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use('/v1/user', userRouter);
app.get('/', (req, res) => {
    console.log("app is listeneing");
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
