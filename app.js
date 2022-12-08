import express from 'express';
import dotenv from 'dotenv';
import conn from "./db.js"
import cookieParser from "cookie-parser"
import pageRoute from "./routes/pageRoute.js"
import photoRoute from "./routes/photoRoute.js"
import userRoute from "./routes/userRoute.js"
import {checkUser} from "./middlewares/authmiddleware.js"
import fetch from 'node-fetch';

dotenv.config();

//connection to the Db
conn();

const app=express();

const port=process.env.PORT;


//ejs template engine
app.set('view engine','ejs')

//static files middleware
app.use(express.static('public'));
app.use(express.json());            //Posttaki json verilerinin expresin okuması için
app.use(express.urlencoded({extended:false}));  //Posttaki form verilerinin expresin okuması için
app.use(cookieParser());


//routes
app.use("*",checkUser) //Tüm get fonksiyonlarında kontrol edeceksin.
app.use("/",pageRoute);
app.use("/photos",photoRoute);
app.use("/users",userRoute);





app.listen(port,()=>{
    console.log(`Application running on:${port}`)
});