const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/refresh', authController.refresh);
router.post('/login',authController.login);
router.post('/logout',authMiddleware,authController.logout);
router.get('/me',authMiddleware,authController.getMe);

module.exports = router;