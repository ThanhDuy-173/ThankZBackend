// import express from 'express';
// import morgan from 'morgan';
// const app = express()

// // const morgan = require('morgan')
// app.use(morgan('combined'))

// const port = 8181

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

import user from './routers/user.router.js'
import diary from './routers/diary.router.js'
import story from './routers/story.router.js'
import media from './routers/media.router.js'
import connDB from './database/connection.js'


const app = express();
const PORT =  process.env.port || 5000;


app.use(bodyParser.urlencoded({extended:true, limit: '30mb'}));
app.use(bodyParser.json({limit: '30mb'}));
app.use(cors());


app.use('/user',user);
app.use('/diary',diary);
app.use('/story',story);
app.use('/media',media);

app.get('/',(req, res) => {
    res.send('Success!')
});



connDB
    .then(()=>{
        console.log('Connected Database')
        app.listen(process.env.PORT || 5000, ()=>{
            console.log(`server is running on port ${PORT}`)
        });
    })
    .catch((err)=>{
        console.error(err)
    });
