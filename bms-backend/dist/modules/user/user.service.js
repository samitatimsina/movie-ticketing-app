"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateUser = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_model_1 = require("./user.model");
//create user
const createUser = async (data) => {
    const newUser = new user_model_1.UserModel(data);
    return await newUser.save();
};
exports.createUser = createUser;
//get all users
const getAllUsers = async () => {
    return await user_model_1.UserModel.find();
};
exports.getAllUsers = getAllUsers;
//get single user
const getUserById = async (id) => {
    return await user_model_1.UserModel.findById(id);
};
exports.getUserById = getUserById;
//get user by email
const getUserByEmail = async (email) => {
    return await user_model_1.UserModel.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
//activate user
const activateUser = async (id, updateData) => {
    const updateUser = await user_model_1.UserModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updateUser) {
        throw new Error('User not found');
    }
    return updateUser;
};
exports.activateUser = activateUser;
