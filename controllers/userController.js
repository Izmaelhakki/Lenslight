import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Photo from "../models/PhotoModel.js";
import { validationResult } from "express-validator";

const createUser = async (req, res) => {

    try {
       
        const hatalar=validationResult(req);
        if(!hatalar.isEmpty()){
            req.flash('validation_error',hatalar.array())
            req.flash('username',req.body.username)
            req.flash('email',req.body.email)
            req.flash('password',req.body.password)
            req.flash('repassword',req.body.repassword)

            res.redirect('/register');
        }
        
        
        const user = await User.create(req.body) //Gelen Req body bilgileri ile tanımlanan User Modelini kullanarak yeni userı veritabanında olustur.
        res.redirect("/login")

    } catch (error) {
     
    }
};


const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }) //Şifrenin veritabanında bulunması

        let same = false;     // Şifre Kontrol durumu                             

        if (user) {
            same = await bcrypt.compare(password, user.password) //Hashli Şifrenin karşılaştırılması
        } else {
            return res.status(401).json({
                succeded: false,
                error: "There is no such user",
            });
        }

        if (same) {

            const token = createToken(user._id);
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, //mili saniye hesaplama (1 gün)
            })

            res.redirect("/users/dashboard");
        } else {
            res.status(401).json({
                succeded: false,
                error: "Password are not matched",
            });
        }

    }

    catch (error) {

        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })
}

const getDashboardPage = async(req, res) => {
    const photos= await Photo.find({user:res.locals.user._id})
    const user=await User.findById({_id:res.locals.user._id}).populate(["followings","followers"])
    res.render("dashboard", {
        link: "dashboard",
        photos,
        user,
    });
}

const getAllUsers = async (req, res) => {

    try {
        const users = await User.find({_id:{$ne:res.locals.user._id}});
        res.status(200).render("users",{
            users,
            link:"users",
        });
    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }
}

const getAUser = async (req, res) => {

    try {
        const user = await User.findById({_id:req.params.id})

        const inFollowers=user.followers.some((follower)=>{
            return follower.equals(res.locals.user._id)
        });

        const photos = await Photo.find({user:user._id})
        res.status(200).render("user",{
            user,
            photos,
            link:"user",
            inFollowers,
        });
    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }
}

const follow = async (req, res) => {

    try {

        let user = await User.findByIdAndUpdate(        //user takip edilecek ve cıkılacak kullanıcı
            {_id:req.params.id},
            {
            $push:{followers:res.locals.user._id}
            },
            {new:true}
        );

        user = await User.findByIdAndUpdate(
            {_id: res.locals.user._id},
            {
                $push:{followings:req.params.id}
            },
            {new:true}
        );

        res.status(200).redirect(`/users/${req.params.id}`)

    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }
};

const unfollow = async (req, res) => {

    try {

        let user = await User.findByIdAndUpdate(        //user takip edilecek ve cıkılacak kullanıcı
            {_id:req.params.id},
            {
            $pull:{followers:res.locals.user._id}
            },
            {new:true}
        )

        user = await User.findByIdAndUpdate(
            {_id: res.locals.user._id},
            {
                $pull:{followings:req.params.id}
            },
            {new:true}
        );

        res.status(200).redirect(`/users/${req.params.id}`)

    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }
};




export {
    createUser,
    loginUser,
    getDashboardPage,
    getAllUsers,
    getAUser,
    follow,
    unfollow,
    
}