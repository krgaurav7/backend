import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverimg, 
    getUserChannelProfile, 
    getWatchHistory 
} from "../controllers/user.controller.js";
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

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword); //done
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-img").patch(verifyJWT, upload.single("cover"), updateUserCoverimg)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile); //params
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router ;

// npm run dev 