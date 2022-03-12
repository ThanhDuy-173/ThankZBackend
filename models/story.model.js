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
    Content: {
        type: String,
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

export const StoryModel = mongoose.model('story',schema);