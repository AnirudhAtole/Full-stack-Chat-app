const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const Authenticate = require('../authenticate/authenticate');

router.post('/chat/send-chat',Authenticate.authenticate,chatController.addChat);
router.get('/chat/get-chats',Authenticate.authenticate,chatController.getChats);
router.get('chats/updated-chats', Authenticate.authenticate , chatController.getUpdatedChats);

module.exports = router;