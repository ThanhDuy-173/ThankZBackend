import express from 'express';
import {getAllUsers, login, register, updateUser, sendEmailUser} from '../controllers/user.controller.js'


const routers = express.Router();

routers.get('/',getAllUsers);
routers.post('/login',login);
routers.post('/register',register);
routers.post('/update',updateUser);
routers.post('/reset',sendEmailUser);

export default routers;