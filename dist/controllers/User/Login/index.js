import asyncHandler from 'express-async-handler';
import signUpValidator from './Validation.js';
import { errors } from "@vinejs/vine";
import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);
const signUp = asyncHandler(async (req, res) => {
    const data = req.body;
    try {
        signUpValidator.validate(data);
    }
    catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            res.status(error.status).send(error.messages);
        }
    }
});
export const sendOtp = asyncHandler(async (req, res) => {
    const data = req.body;
    try {
        await signUpValidator.validate(data);
        const { email, name } = data;
        const otp = generateOtp();
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `Welcome to z-draw ${name}`,
            html: `<p>Congrats on getting your otp,here it is ${otp}</p>`
        });
        res.status(200).send('otp sent successfullt');
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
