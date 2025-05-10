
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // 100000 to 999999

}