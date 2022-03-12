import express from 'express';
import {getAllStories, getStoriesByUser} from '../controllers/story.controller.js'


const routers = express.Router();

routers.get('/',getAllStories);
// routers.get('/user/:id',getStoriesByUser);
routers.post('/user',getStoriesByUser);

export default routers;