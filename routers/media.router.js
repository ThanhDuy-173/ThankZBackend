import express from 'express';
import {getAllMedias, getMediaByUser} from '../controllers/media.controller.js'


const routers = express.Router();

routers.get('/',getAllMedias);
// routers.get('/user/:id',getMediaByUser);
routers.post('/user',getMediaByUser);

export default routers;