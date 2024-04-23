import asyncHandler from 'express-async-handler'
import { signUpValidator } from './Validation'
import vine, { errors } from "@vinejs/vine";


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



