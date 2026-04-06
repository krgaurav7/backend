import { Router } from "express";
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controller.js";
import  {upload} from "../middleware/multer.js";
import {verifyJWT} from "../middleware/auth.js"

const router = Router(); 

router.route("/createTweet").post(verifyJWT , createTweet);
router.route("/get-all-tweets").get(verifyJWT, getUserTweets);
router.route("/updateTweet/:tweetId").patch(verifyJWT, updateTweet); // patch - used for partial updates to an existing resource, modifying only specific fields rather than replacing the entire entity
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet)


export default router;