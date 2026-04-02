import { Request,Response,NextFunction } from "express";
import * as OtpService from "./otp.service";
import * as UserService from "../user/user.service";
import * as TokenService from "./token.sevice";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils";
import { NestedPaths } from "mongoose";

export const sendOtp = async(req:Request,res:Response,next:NextFunction)=> {
    try{
        const { email } = req.body;
        if(!email){
            const err = new createHttpError.BadRequest("Email is required");
            return next(err);
        }
        if(!isValidEmail(email)){
            const err = new createHttpError.BadRequest("Invalid email format");
            return next(err);
        }

        //create otp
        const otp = OtpService.generateOTP();

        //hash otp
        const ttl = 1000*60*2;
        const expires = Date.now()+ttl;
        const data = `${email}.${otp}.${expires}`;
        const hashedOTP = OtpService.hashOTP(data);

        //send otp to user email
        try{
            await OtpService.sendOTPtoEmail(email,otp);
        }catch(error){
            const err = new createHttpError.InternalServerError("Error sending otp to email");
            return next(err);
        }

        //respond to the client
        res.json({
            hash:`${hashedOTP}.${expires}`,
            email,msg:"OTP sent to email successfully!!"
        })

    }catch(error){
        next(error);
    }
}

export const verifyOTP = async(req:Request,res:Response,next:NextFunction) => {
    const { email,otp,hash } = req.body;

    if(!email || !otp || !hash){
        const err = new createHttpError.BadRequest("All fields are required");
        return next(err);
    }

    //otp verification
    const [hashedOTP,expires] = hash.split(".");
    if(Date.now() >+expires){
        const err = new createHttpError.Gone("OTP expired");
        return next(err);
    }
    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOTP(hashedOTP,data);

    if(!isValid){
        const err = new createHttpError.Unauthorized("Invalid otp");
        return next(err);
    }
    //find or create new user
    let user;
    try{
        user = await UserService.getUserByEmail(email);
        if(!user){
            user=await UserService.createUser({
                email,
                name:"New User"
            });
        }
    }catch(error){
        return next(error);
    }

    //generate token
    const {accessToken , refreshToken } = TokenService.generateToken(
        {_id:user._id,email:user.email}
    );

    //store refresh token in DB 
    await TokenService.storeRefreshToken(user._id as string, refreshToken);

    //sending token in cookies
    res.cookie('accessToken',accessToken,{
        maxAge:1000*60*60,
        httpOnly:true,
        sameSite:'lax',
        secure:false
    })

    res.cookie('refreshToken',refreshToken,{
        maxAge:1000*60*60,
        httpOnly:true,
        sameSite:'lax',
        secure:false
    })
    res.json({auth:true,user});
}

export const logout = async (req:Request,res: Response,next:NextFunction) => {
    try{
        const { refreshToken } = req.cookies;

        //delete refresh token from db
        await TokenService.deleteRefreshToken(refreshToken);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({msg: "Logged out successfully"}).status(200);
    }catch(error){
        next(error);
    }
}