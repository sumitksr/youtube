import { Router } from 'express';
import { 
    registerUser,
    loginUser,
    logoutUser ,
    refreshAccessToken ,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getUserChannelProfile,
    updateUserCoverImage,
    updateUserAvatar,
    getWatchHistory 
} from '../controllers/user.js';
import {upload} from '../middlewares/multer.js';
import { verifyJWT } from '../middlewares/auth.js';


const router = Router();
router.post('/register', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), registerUser);
router.post('/login', upload.none(), loginUser);

// Logout route
router.post('/logout', verifyJWT, logoutUser);

router.post('/refresh-token', refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router .post("/current-user", verifyJWT, getCurrentUser);
router .post("/update-profile", verifyJWT, updateAccountDetails);
router.post("/update-cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.post("/update-avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.get("/channel/:username", verifyJWT, getUserChannelProfile);
router.get("/history", verifyJWT, getWatchHistory);




export default router;