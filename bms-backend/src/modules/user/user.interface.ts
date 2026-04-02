
export interface IUser{
    _id?:string;
    email:string;
    name:string;
    phone?:string;
    birthday:string;
    gender:string;
    role:'admin' | 'user';
    activateUser?:boolean;
    createdAt:Date;
    updatedAt:Date;
}