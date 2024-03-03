import { createTransport } from 'nodemailer';
import crypto from 'crypto';

const email_sender = "ninhnam027@gmail.com"
const password_sender = "indydkfcuupjnhzi"

export const sendEmail = async (to, subject, text) => {
    let transporter = createTransport({
        service: 'gmail',
        auth: {
            user: email_sender, 
            pass: password_sender 
        }
    });

    let mailOptions = {
        from: email_sender,
        to: to, 
        subject: subject, 
        text: text 
    };

    await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export const generateUniqueHash = () => {
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString()); 
    const uniqueHash = hash.digest('hex').substring(0, 16); 
    return uniqueHash;
};

export const getTimestampPlus30Minutes = () => {
    const currentTimestamp = Date.now();
    const thirtyMinutesInMillis = 30 * 60 * 1000;
    const timestampPlus30Minutes = currentTimestamp + thirtyMinutesInMillis; 
    return timestampPlus30Minutes;
};


