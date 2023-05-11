const express = require('express');
const multer = require('multer');
const router = express.Router();
const chatController = require('../controllers/chat');
const Authenticate = require('../authenticate/authenticate');

const storage = multer.memoryStorage();
const upload = multer({storage:storage})

router.post('/chat/send-chat',Authenticate.authenticate,chatController.addChat);
router.get('/chat/get-chats',Authenticate.authenticate,chatController.getChats);
router.get('/chats/updated-chats', Authenticate.authenticate , chatController.getUpdatedChats);
router.post('/chats/send-file',Authenticate.authenticate ,upload.single('file'),chatController.sendFile)

module.exports = router;