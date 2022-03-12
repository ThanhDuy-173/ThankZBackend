import express from 'express';
import {getAllBooks,getBookHistorys,viewBook, likeBook, saveBook, addBook, deleteBook, updateBook} from '../controllers/books.controller.js'


const routers = express.Router();

routers.get('/',getAllBooks);
routers.post('/getBookHistorys',getBookHistorys)
routers.post('/view', viewBook);
routers.post('/like', likeBook);
routers.post('/save', saveBook);
routers.post('/add', addBook);
routers.post('/update', updateBook);
routers.post('/delete', deleteBook);

export default routers;
