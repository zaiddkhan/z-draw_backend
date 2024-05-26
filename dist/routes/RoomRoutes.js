import express from 'express';
import { createRoom, getRoomStatus, leaveRoom } from '../controllers/Room/index.js';
const roomRouter = express.Router();
roomRouter.route('/create').post(createRoom);
roomRouter.route('/get/status').get(getRoomStatus);
roomRouter.route('/leave').post(leaveRoom);
export default roomRouter;
