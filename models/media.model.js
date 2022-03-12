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
    IDStory: {
        type: String,
        default: "",
    },
    Type: {
        type: String,
        required: true,
    },
    Src: {
        type: Array, 
        required: true,
    },
    Date: { 
        type: String,
        required: true,
    },
    Time: {
        type: String,
        required: true,
    }
},{timestamps: true})

export const MediaModel = mongoose.model('media',schema);