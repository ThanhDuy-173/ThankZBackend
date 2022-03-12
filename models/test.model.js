import mongoose from "mongoose";

const schema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        required: true,
    },
    Author: {
        type: String,
        required: true,
    },
    Type: { 
        type: String, 
        required:true,
    },
    Description: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        default: 'waitting'
    },
    PublisingCompany: {
        type: String,
    },
    Company: {
        type: String,
    },
    Star:{
        type: Number,
    },
    Audio: {
        type: Array,
    },
    PDF: {
        type: String,
    }  
},{timestamps: true})

export const BookModel = mongoose.model('book',schema);