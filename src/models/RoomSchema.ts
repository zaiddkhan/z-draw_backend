import { Schema,model } from 'mongoose';

interface Room{
    room_id : String,
    max_players : number,
    start_time : number,
    roomName : String,
    host_id : String,
    joined_by : Array<String>,
    expiry_time : number
}

const roomSchema = new Schema<Room>({
   room_id: {
      type: String,
      required: true,
    },
    max_players: {
      type: Number,
      default : 0,
      required: true,
    },
    start_time: {
      type: Number,
      default: Date.now
     },
     host_id : {
        type : String,
        required : true
     },
     joined_by : {
        type : [String],
        required : true
     },
     expiry_time : {
        type : Number
     }
 });

 export const ROOM = model<Room>("ROOM",roomSchema)