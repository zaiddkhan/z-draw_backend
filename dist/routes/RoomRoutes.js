import express from 'express';
import { createRoom, getRoomStatus } from '../controllers/Room/index.js';
const roomRouter = express.Router();
roomRouter.route('/create').post(createRoom);
roomRouter.route('/get/status').get(getRoomStatus);
export default roomRouter;
