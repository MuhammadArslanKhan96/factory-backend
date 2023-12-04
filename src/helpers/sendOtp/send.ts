import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arslandev170@gmail.com', 
        pass: 'uevf bgmr efwc oczz', 
    },
});