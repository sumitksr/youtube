const { Router } = require('express');
const { registerUser } = require('../controllers/user.js');


const router = Router();
router.post('/register', registerUser);


export default router;