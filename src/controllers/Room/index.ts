import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../helper.js';
import {generateRandomNum } from '../../helper.js'
import { roomDataValidator } from './Validation.js';
import { ROOM } from '../../models/RoomSchema.js';
import { UpdateWriteOpResult } from 'mongoose';
import exp from 'constants';



export const createRoom = (async(req : Request,res : Response,next :NextFunction) => {
    try{
        const data = req.body;
        await roomDataValidator.validate(data);
        
        const roomId = generateRandomNum();
        const expiryTime = Date.now() + 120*1000

        const room =  {
            room_id : roomId,
            max_players : data.max_players,
            start_time : Date.now(),
            room_name : data.room_name,
            host_id : data.host_id,
            joined_by : [data.host_id],
            expiry_time : expiryTime
        }
        const result = await ROOM.create(room)
        
        return res.status(200).json(
            room
        )


    }catch(err ){
        if (err instanceof Error) {
            return res.status(500).json({
                id: '0',
                message: err.message
            });
        } else {
            // If it's not an Error, handle it or return a generic message
            return res.status(500).json({
                id: '0',
                message: 'An unknown error occurred'
            });
        }
    }
});

export const getRoomStatus = asyncHandler(async (req,res,next) => {
    try{
        const roomId = req.query.room_id
        if(roomId == '' && roomId == undefined){
            res.status(500).json({
                'id' : '0',
                'message' : 'invalid params'
            })
        }
        const room = await ROOM.findOne({
            room_id : roomId
        });
        if(room == null){
            res.status(500).json({
                'id' : '0',
                'message' : 'room not found'
            })
        }else{
            const currTime = Date.now();
            if(currTime > room.expiry_time){
                const deletedRoom = await ROOM.findOneAndDelete({ room_id: roomId });
                if (deletedRoom) {
                    res.status(200).json({
                        id: '0',
                        message: 'Room is not active and has been deleted'
                    });
                } else {
                    res.status(404).json({
                        id: '1',
                        message: 'No room found with the given ID'
                    });
                }
                
            }else{
                res.status(200).json({
                    id : '1',
                    message : 'room is active'
                })
            }
        }
        res.status(200).json({
            id : '1',
            message : 'success'
        })

    }catch(err){

    }
})

export const joinRoom = asyncHandler(async(req,res) => {
    try{
        const room_id : String = req.body.room_id
        const user_id : String = req.body.user_id
        if(room_id == '' || room_id == undefined){
            res.status(500).json({
                id : '0',
                message : 'no room id'
            })
        }
        const room = ROOM.findOne({
            room_id : room_id
        })
        if(room == null){
            res.status(400).json({
                id : '0',
                message : 'no room found for the given id'
            })
        }else{
           const result : UpdateWriteOpResult = await ROOM.updateOne({ room_id : room_id },
            { $addToSet : { joined_by : user_id }} );
            console.log(result);
            res.status(200).json({
                id : '1',
                message : 'user joined successfully'
            })
        }
    }catch(err){

    }
})

export const leaveRoom = asyncHandler(async(req,res) => {
    try{
        const room_id : String = req.body.room_id
        const user_id : String = req.body.user_id
        if(room_id == '' || room_id == undefined){
            res.status(500).json({
                id : '0',
                message : 'no room id'
            })
        }
        const room = ROOM.findOne({
            room_id : room_id
        })
        if(room == null){
            res.status(400).json({
                id : '0',
                message : 'no room found for the given id'
            })
        }else{
           const result : UpdateWriteOpResult = await ROOM.updateOne({ room_id : room_id },
            { $pull : { joined_by : user_id }} );
            console.log(result);
            res.status(200).json({
                id : '1',
                message : 'user removed successfully'
            })
        }
    }catch(err){

    }
})
