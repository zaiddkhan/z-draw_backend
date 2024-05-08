import { z } from 'zod';
export const signUpSchema = z.object({
    name: z.string().min(5).refine(val => val.trim().length >= 5, {
        message: "Please enter name"
    }),
    email: z.string().email("The value is not a valid email address")
});
export const createProfileSchema = z.object({
    nickname: z.string().min(1),
    favourite_food: z.string().min(1),
    hobby: z.string().min(4),
    email: z.string().email("The value is not a valid email address")
});
