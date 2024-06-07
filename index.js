import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router/router.js';
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"

const app = express();
dotenv.config()
// COrs Origin
app.use(cors());
app.use(fileUpload())
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

// all routes 
app.use('/api', router)

app.get('/api/helath_check', (req, res) => {
    return res.send({
        status: true,
        response_code: 200,
        message: "Welcome to my RC API server!"
    })
});




app.get('/api/test', (req, res) => {
    return res.send({
        status: true,
        response_code: 200,
        message: "Welcome to my RC API server!"
    })
});



// app.use(express.static('../Frontend/build'))
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve('../Frontend/build', 'index.html'))
// })
app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
});