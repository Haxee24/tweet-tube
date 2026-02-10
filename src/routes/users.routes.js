import { Router } from "express";
import { registerUser, showProfile } from "../controllers/users.controller.js";
import upload from '../middleware/multer.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {name: "profilePicture", maxCount: 1},
        {name: "coverPicture", maxCount: 1}
    ]),
    registerUser
);

router.get("/profile", showProfile);

export default router;