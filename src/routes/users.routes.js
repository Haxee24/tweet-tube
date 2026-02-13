import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { registerUser, loginUser, logoutUser, showProfile } from "../controllers/users.controller.js";
import upload from '../middleware/multer.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {name: "profilePicture", maxCount: 1},
        {name: "coverPicture", maxCount: 1}
    ]),
    registerUser
);

router.post("/login", loginUser);

//secured routes
router.post("/logout", verifyJWT, logoutUser);

router.get("/profile", showProfile);

export default router;