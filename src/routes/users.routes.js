import { Router } from "express";
import { registerUser } from "../controllers/users.controller.js";
import {upload} from "multer";

const router = Router();

router.route("/register").post(
    upload.fields([
        {name: "profilePicture", maxCount: 1},
        {name: "coverPicture", maxCount: 1}
    ]),
    registerUser
)

export default router;