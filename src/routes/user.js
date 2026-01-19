import { Router } from 'express';
import { registerUser } from '../controllers/user.js';
import {upload} from '../middlewares/multer.js';


const router = Router();
router.post('/register', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]), registerUser);

export default router;