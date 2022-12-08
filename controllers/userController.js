import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createUser = async (req, res) => {

    try {
        console.log(req.body);
        const user = await User.create(req.body) //Gelen Req body bilgileri ile tanımlanan User Modelini kullanarak yeni userı veritabanında olustur.
        res.status(201).json({
            succeded: true,
            user,
        });

    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        })
    }
};

const loginUser = async (req, res) => {
   try {
        const {username,password}=req.body;

        const user=await User.findOne({username}) //Şifrenin veritabanında bulunması

        let same=false;     // Şifre Kontrol durumu                             

        if(user){
            same=await bcrypt.compare(password,user.password) //Hashli Şifrenin karşılaştırılması
        }else{
            return res.status(401).json({
                succeded: false,
                error:"There is no such user",
            });
        }

        if(same){
            res.status(200).json({
                user,
                token:createToken(user._id)
            })
        }else{
            res.status(401).json({
                succeded: false,
                error:"Password are not matched",
            }); 
        }

    }

     catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }
};

const createToken=(userId)=>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"1d",
    })
}


    export {
        createUser,
        loginUser,
            }