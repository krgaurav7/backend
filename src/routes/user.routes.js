import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import  {upload} from "../middleware/multer.js";
import {verifyJWT} from "../middleware/auth.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
) // POST /users/register

router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refreshtoken").post(refreshAccessToken);

export default router ;