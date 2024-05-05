export const supportedMimes = [
    "image/png", "image/jpg", "image/jpeg", "image/svg", "image/png", "image/webp", "image/gif"
];
export const imageValidator = (size, mimeType) => {
    if (bytesToMb(size) > 2) {
        return "Image size must be less than 2MB";
    }
    else if (!supportedMimes.includes(mimeType)) {
        return "Image type not supported";
    }
    return null;
};
export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024);
};
