import mongoose from "mongoose";

const schema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    DoB: { 
        type: String,
    },
    Avatar: {
        type: String, 
        default: "",
    },
    Type: {
        type: String,
        required: true,
    }
},{timestamps: true})

export const UserModel = mongoose.model('user',schema);