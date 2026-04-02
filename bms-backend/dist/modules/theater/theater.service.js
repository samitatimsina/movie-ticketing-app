"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheaterByState = exports.getTheaterById = exports.getAllTheaters = exports.createTheater = void 0;
const theater_model_1 = require("./theater.model");
const createTheater = async (data) => {
    return await theater_model_1.TheaterModel.create(data);
};
exports.createTheater = createTheater;
//Get all theater
const getAllTheaters = async () => {
    return await theater_model_1.TheaterModel.find();
};
exports.getAllTheaters = getAllTheaters;
//Get theater by id
const getTheaterById = async (id) => {
    return await theater_model_1.TheaterModel.findById(id);
};
exports.getTheaterById = getTheaterById;
//get Theater By States
const getTheaterByState = async (state) => {
    return await theater_model_1.TheaterModel.find({ state: { $regex: state, $options: "i" } });
};
exports.getTheaterByState = getTheaterByState;
