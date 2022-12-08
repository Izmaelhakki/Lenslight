import Photo from "../models/PhotoModel.js"

const createPhoto = async (req, res) => {

    try {
        await Photo.create({
            name:req.body.name,
            description:req.body.description,
            user:res.locals.user._id,
        });  
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
        const photos = await Photo.find({});
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
        const photo = await Photo.findById({_id:req.params.id});
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