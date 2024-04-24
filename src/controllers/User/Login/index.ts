import asyncHandler from 'express-async-handler'
import  signUpValidator  from './Validation.js'
import vine, { errors } from "@vinejs/vine";
import dotenv from 'dotenv'
import {Twilio} from 'twilio';

const twilio = (await import('twilio')).default;

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const signUp = asyncHandler(async (req,res) => {
    const data = req.body;
    try{
       signUpValidator.validate(data);
    }catch(error){
        if (error instanceof errors.E_VALIDATION_ERROR) {
            res.status(error.status).send(error.messages);
          }
    }
});




dotenv.config();  


export const sendOtp = asyncHandler(async (req,res) => {
     const { countryCode,phoneNumber } = req.body;
     try{
        const otpResponse = await client.messages.create({
            from : '555555',
            to : "9326315040",
            body : "Sms sent"
        })
    
    
        res.status(200).send(
            'otp sent successfullt'
        )

     }catch(err){
        res.status(400).send('errororor')
     }

})



