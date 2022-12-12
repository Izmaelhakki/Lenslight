import express from 'express';
import dotenv from 'dotenv';
import conn from "./db.js";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import pageRoute from "./routes/pageRoute.js";
import photoRoute from "./routes/photoRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkUser } from "./middlewares/authmiddleware.js";
import fileupload from 'express-fileupload';
import { v2 as cloudinary } from "cloudinary";
import { errCatching } from "./middlewares/errMiddleware.js"
import session from 'express-session';
import flash from 'connect-flash';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//connection to the Db
conn();

const app = express();

const port = process.env.PORT;

//session ve flash message
app.use(session(
    {
        secret: process.env.SECRET_SESSION,
        resave: false,
        saveUninitialized:true,
    }
)); 

app.use(flash());
app.use((req,res,next)=>{
    res.locals.validation_error=req.flash('validation_error');
    res.locals.username=req.flash('username');
    res.locals.email=req.flash('email');
    res.locals.password=req.flash('password');
    res.locals.repassword=req.flash('repassword');
    next();
})  

//ejs template engine
app.set('view engine', 'ejs')

//static files middleware
app.use(express.static('public'));
app.use(express.json());            //Posttaki json verilerinin expresin okuması için
app.use(express.urlencoded({ extended: false }));  //Posttaki form verilerinin expresin okuması için
app.use(cookieParser());
app.use(fileupload({ useTempFiles: true }))
app.use(methodOverride("_method", {
    methods: ["POST", "GET"],
}))



//routes
app.use("*", checkUser) //Tüm get fonksiyonlarında kontrol edeceksin.
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/users", userRoute);




app.use(errCatching);

app.listen(port, () => {
    console.log(`Application running on:${port}`)
});