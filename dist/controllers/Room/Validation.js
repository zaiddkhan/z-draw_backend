import vine from "@vinejs/vine";
const roomDataSchema = vine.object({
    max_players: vine.number().min(1),
    host_id: vine.string(),
    room_name: vine.string().minLength(2)
});
export const roomDataValidator = vine.compile(roomDataSchema);
