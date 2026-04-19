import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import {getVideoComments, 
    addComment, 
    updateComment,
    deleteComment } from "../controllers/comment.controller.js"

const router = Router();

router.route("/video-comment/:videoId").get(getVideoComments);
router.route("/add-comment/:videoId").post(verifyJWT, addComment);
router.route("/update-comment/:commentId").patch(verifyJWT, updateComment);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);

export default router;