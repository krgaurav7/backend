import { Router } from "express";
import {verifyJWT} from "../middleware/auth.js"
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import { get } from "mongoose";

const router = Router();

router.route("/comment/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/video/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/liked-video").get(verifyJWT, getLikedVideos);

export default router;