import express from 'express';
import { createRoom, getRoomStatus, joinRoom, leaveRoom } from '../controllers/Room/index.js';
const roomRouter = express.Router();
roomRouter.route('/create').post(createRoom);
roomRouter.route('/get/status').get(getRoomStatus);
roomRouter.route('/join').post(joinRoom);
roomRouter.route('/leave').post(leaveRoom);
export default roomRouter;
