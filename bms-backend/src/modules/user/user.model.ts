import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,select:false},
    role:{type:String,enum:['admin','user'],default:'user'},
    phone:{type:String},
    birthday:{type:String},
    gender:{type:String},
    activateUser:{type:Boolean,default:true},
},{
    timestamps:true,
});

export const UserModel = mongoose.model<IUser>('User',userSchema);