import User from "../models/userModel.js"

const createUser = async (req, res) => {

    try {
        console.log(req.body);
        const user = await User.create(req.body)
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


    export {createUser}