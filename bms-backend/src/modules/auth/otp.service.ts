import crypto from 'crypto';
import { config } from '../../config/config';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

//generate otp
export const generateOTP = () => {
    const otp = crypto.randomInt(1000,9999);
    return otp;
}

//hash otp
export const hashOTP = (data:string) => {
    if(!config.hashingSecret){
        throw new Error ('Hashing secret is not defined');
    }

    return crypto.createHmac('sha256',config.hashingSecret).update(data).digest('hex');

}

//verify otp
export const verifyOTP = (hashedOTP:string,data:string)=>{
    const newHashedOTP = hashOTP(data);
    return newHashedOTP === hashedOTP;
}

//send otp via email
const _config = {
    service:'gmail' as string,
    auth:{
        user:config.emailUsername,
        pass:config.emailPassword
    }
}

const transporter = nodemailer.createTransport(_config);
const mailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"movieTickets",
        link:"https://samita.vercel.app",
        logo:"https://res-console.cloudinary.com/dey60qlcv/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/bW92aWUtdGlja2V0c19lcWhlbnY=/template_primary"
    },
});

export const sendOTPtoEmail = async (email:string,otp:number)=> {
    const emailTemp:any = {
         body: {
                name: '',
                intro: 'Welcome to MovieTickets! We\'re very excited to have you on board.',
                action: {
                    instructions: 'To verify your account, please use the following OTP:',
                    button: {
                        color: '#323232', // Optional action button color
                        text: otp,
                        link: '#'
                    }
                },
                outro: 'This OTP will expire in a short time (2 mins) for security reasons. If you did not request this OTP, please ignore this email.'
            }
        };

        const mail = mailGenerator.generate(emailTemp);
        let message = {
            from: config.emailUsername,
            to:email,
            subject:"Your otp for movietickets",
            html:mail
        }

        const info = await transporter.sendMail(message);
        return info.messageId;
    }
