import mongoose from "mongoose";

const schema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
    },
    IDUser: {
        type: String,
        required: true,
    },
    Type: {
        type: String,
        required: true,
    },
    IDDiary: {
        type: String,
        default: "",
    },
    Date: { 
        type: String,
        required: true,
    }
},{timestamps: true})

export const DiaryModel = mongoose.model('diary',schema);