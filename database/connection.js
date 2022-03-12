import mongoose from 'mongoose';
import {DBurl} from "./DBurl.js"

const connDB = mongoose.connect(DBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export default connDB