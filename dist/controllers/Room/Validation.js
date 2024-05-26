import { z } from 'zod';
export const roomDataSchema = z.object({
    maxPlayers: z.number().min(1), // ensure at least 1 player
    host_id: z.string(), // simple string
    room_name: z.string().min(2), // string with a minimum length of 2
    totalChances: z.number().min(1)
});
