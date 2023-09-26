const bcrypt = require("bcryptjs");

const User = require('../models/UserModel');

const customerService = require("./CustomerService")

const createUser = async (username, password) => { // User Creation
    const user = new User({
        Username : username,
        Password : password
    });
    const existsUser = await User.exists({Username : username});
    if(!existsUser){ // if user is undefined/null/false etc
        return await user.save();
    }
    return null;
};
const getUserByUsername = async (username) => {
    return await User.findOne({Username: username});
};
const getUserById = async (id) => {
    return await User.findById(id);
};
// --------------------------ONLY FOR ADMINS!!------------------------
const getAllUsers = async () => { 
    return await User.find({});
};
const updateUser = async (id, password, isAdmin) => { // for no change pass null values!
    const user = await getUserById(id);
    if (!user)
        return null;
    if(password){
        user.Password = await bcrypt.hash(password, 10);
    }
    user.isAdmin = isAdmin;
    await user.save();
    return user;
};
const deleteUser = async (id) => {
    const user = await getUserById(id);
    if (!user)
        return null;

    return await User.findByIdAndRemove(id);
};
module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    getUserByUsername,
    updateUser,
    deleteUser
}