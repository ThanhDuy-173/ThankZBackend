import express from 'express';
import {getAllDiaries, getDiariesByUser, addDiary, updateDiary, deleteDiary} from '../controllers/diary.controller.js'


const routers = express.Router();

routers.get('/',getAllDiaries);
// routers.get('/user/:id',getDiariesByUser);
routers.post('/user',getDiariesByUser);
routers.post('/add',addDiary);
routers.post('/update',updateDiary);
routers.post('/delete',deleteDiary);

export default routers;