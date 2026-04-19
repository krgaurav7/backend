import {Router} from "express";
import {verifyJWT} from "../middleware/auth.js"
import {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/fetch-playlist").get(verifyJWT, getUserPlaylists);
router.route("/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/add-video/:playlistId").post(verifyJWT, addVideoToPlaylist);
router.route("/remove-video/:playlistId").patch(verifyJWT, removeVideoFromPlaylist);
router.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/update-playlist/:playlistId").patch(verifyJWT, updatePlaylist);

export default router;
