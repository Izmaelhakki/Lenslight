import mongoose from "mongoose";

const conn=()=>{
    mongoose.connect(process.env.DB_URI,{
        dbName:'lenslight',
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },mongoose.set('strictQuery', true)
    ).then(()=>{
        console.log("Connected to the Db succesfully");
    }).catch((err)=>{
        console.log(`Connection err:${err}`);
    });
};

export default conn;
