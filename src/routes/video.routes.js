import { Router } from "express";
import  {upload} from "../middleware/multer.js";
import {verifyJWT} from "../middleware/auth.js"
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus } from "../controllers/video.controller.js"

const router = Router();

router.route("/getAllVideos").get( getAllVideos);
router.route("/getVideobyid/:videoId").get(verifyJWT , getVideoById);
router.route("/:videoId").delete(verifyJWT, deleteVideo);
router.route("/update-video/:videoId").patch(verifyJWT,upload.single("thumbnail"), updateVideo);
router.route("/change-video-status/:videoId").patch(verifyJWT, togglePublishStatus);
router.route("/publish_video").post(verifyJWT, upload.fields([
    {name : "thumbnail", maxCount:1} , {name : "videoFile", maxCount:1}
]), publishAVideo);

export default router;