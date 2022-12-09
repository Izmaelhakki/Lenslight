import Photo from "../models/PhotoModel.js";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

const createPhoto = async (req, res) => {

    const result=await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename:true,
            folder:'lenslight'
        }
    )

    try {
        await Photo.create({
            name:req.body.name,
            description:req.body.description,
            user:res.locals.user._id,
            url:result.secure_url,
        });

        fs.unlinkSync(req.files.image.tempFilePath);

        res.status(201).redirect("/users/dashboard");
        }

     catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        })
    }
};

const getAllPhotos = async (req, res) => {

    try {
        const photos =res.locals.user 
        ? await Photo.find({user:{$ne:res.locals.user._id}})
        : await Photo.find({});
        res.status(200).render("photos",{
            photos,
            link:"photos",
        });
 
        
    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }

}

const getAPhoto = async (req, res) => {

    try {
        const photo = await Photo.findById({_id:req.params.id}).populate("user");
        res.status(200).render("photo",{
            photo,
            link:"photo",
        });
    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }

}



    export {
        createPhoto,
        getAllPhotos,
        getAPhoto,
    }