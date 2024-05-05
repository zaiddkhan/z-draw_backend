import mongoose from "mongoose";
import { Schema,model } from 'mongoose';

interface Otp {
  email : String,
  otp : String,
  createdAt : Date
}
const otpSchema = new Schema<Otp>({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
    },
  });

 export const OTP = model<Otp>("OTP",otpSchema)