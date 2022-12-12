import express from "express";
import * as userController from "../controllers/userController.js"
import * as authMiddleware from "../middlewares/authmiddleware.js"
import * as validationMiddleware from "../middlewares/validationMiddleware.js"

const router=express.Router();


router.route("/register").post(validationMiddleware.validateNewUser(),userController.createUser);

router.route("/login").post(userController.loginUser);

router.route("/dashboard").get(authMiddleware.authenticateToken, userController.getDashboardPage);

router.route("/").get(authMiddleware.authenticateToken,userController.getAllUsers);

router.route("/:id").get(authMiddleware.authenticateToken,userController.getAUser);

router.route("/:id/follow").put(authMiddleware.authenticateToken,userController.follow);

router.route("/:id/unfollow").put(authMiddleware.authenticateToken,userController.unfollow);



export default router;   