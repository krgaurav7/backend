import {Router} from "express"
import {verifyJWT} from "../middleware/auth.js"
import {toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js"

const router = Router();

router.route("/channel/:channelId").post(verifyJWT, toggleSubscription);
router.route("/subscribers/:channelId").get(verifyJWT, getUserChannelSubscribers);
router.route("/subscribed/:subscriberId").get(verifyJWT, getSubscribedChannels);

export default router;