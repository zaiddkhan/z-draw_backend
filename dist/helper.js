import { v4 as uuid } from 'uuid';
// Function that wraps an async route handler to catch errors
export function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
export const generateRandomNum = () => {
    return uuid();
};
