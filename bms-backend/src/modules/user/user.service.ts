import { email } from "zod/v4";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";


//create user
export const createUser = async (data:any) => {
    const newUser = new UserModel(data);
    return await newUser.save();
}

//get all users
export const getAllUsers = async (): Promise<IUser[]> => {
    return await UserModel.find();
}

//get single user
export const getUserById = async (id:string):Promise<IUser | null> => {
    return await UserModel.findById(id);
}

//get user by email
export const getUserByEmail = async(email:string):Promise<IUser | null > => {
    return await UserModel.findOne({email});
}

//activate user
export const activateUser = async (id:string, updateData:Partial<IUser>):Promise<IUser | null> => {
    const updateUser = await UserModel.findByIdAndUpdate(id,updateData,{new:true});

    if(!updateUser){
        throw new Error('User not found');
    }
    return updateUser;
}