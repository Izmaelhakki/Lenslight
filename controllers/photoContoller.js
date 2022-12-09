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
            image_id:result.public_id,
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


const deletePhoto = async (req, res) => {

    try {
       
        const photo=await Photo.findById(req.params.id)

        const photoId=photo.image_id

        await cloudinary.uploader.destroy(photoId)

        await Photo.findByIdAndDelete({_id:req.params.id})

        res.status(200).redirect("/users/dashboard");

    } catch (err) {
        res.status(500).json({
            succeded: false,
            err,
        });
    }

}

const updatePhoto = async (req, res) => {

    try {
  
        const photo=await Photo.findById(req.params.id)
        
        if(req.files){
        //eskisi silindidi
         const photoId=photo.image_id
         await cloudinary.uploader.destroy(photoId)
         //Yenisi Yüklendi
         const result=await cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            {
                use_filename:true,
                folder:'lenslight'
            }
        );
        photo.url=result.secure_url;
        photo.image_id=result.public_id;
        
        fs.unlinkSync(req.files.image.tempFilePath);
        }

        photo.name=req.body.name;
        photo.description=req.body.description;

        photo.save();

        res.status(200).redirect(`/photos/${req.params.id}`)

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
        deletePhoto,
        updatePhoto,

    }