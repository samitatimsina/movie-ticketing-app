import { TheaterModel } from "./theater.model";

//createTheater
import { IThreater } from "./theater.interface";

export const createTheater = async (data:IThreater): Promise<IThreater> => {
    return await TheaterModel.create(data);
}

//Get all theater
export const getAllTheaters = async (): Promise<IThreater[]> => {
    return await TheaterModel.find();
}

//Get theater by id
export const getTheaterById = async (id:string): Promise<IThreater |null > => {
    return await TheaterModel.findById(id);
}

//get Theater By States
export const getTheaterByState = async (state:string): Promise<IThreater[]> => {
    return await TheaterModel.find({state: {$regex:state, $options:"i"}});
}

