import {
    Router
    } from "express";
import {
    verifyJWT
    } from "../middleware/auth.js"
import {
    getChannelStats, 
    getChannelVideos
    } from "../controllers/dashboard.controller.js"

const router = Router();

router.route("/channel-stat/:channelId").get(verifyJWT, getChannelStats);
router.route("/channel-video/:channelId").get(getChannelVideos);

export default router;