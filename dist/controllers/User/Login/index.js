import asyncHandler from 'express-async-handler';
import signUpValidator from './Validation.js';
import { errors } from "@vinejs/vine";
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { OTP } from '../../../models/OtpSchema.js';
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendOtp = asyncHandler(async (req, res) => {
    const data = req.body;
    try {
        await signUpValidator.validate(data);
        const { email, name } = data;
        const otp = generateOtp();
        const otpPayload = { email, otp };
        await OTP.create(otpPayload);
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `Welcome to z-draw ${name}`,
            html: `<p>Congrats on getting your otp,here it is ${otp}</p>`
        });
        res.status(200).json({
            id: 1,
            message: 'Otp sent successfully',
            otp: otp
        });
    }
    catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            console.log('validation error');
            res.status(error.status).send(error.messages);
        }
        else {
            res.status(400).json({
                'message': error
            });
        }
    }
});
export const verifyOtp = asyncHandler(async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!otp || !email) {
            res.status(403).json({
                id: '0',
                message: 'please provide the details'
            });
        }
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length == 0 || otp != response[0].otp) {
            res.status(400).json({
                id: '0',
                message: 'The OTP is not valid',
            });
        }
        res.status(201).json({
            id: 1,
            message: 'Otp verified',
            email: email
        });
    }
    catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            console.log('validation error');
            res.status(error.status).send(error.messages);
        }
        else {
            res.status(400).json({
                'message': error
            });
        }
    }
});
function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
