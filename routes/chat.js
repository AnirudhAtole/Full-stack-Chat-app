const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const Authenticate = require('../authenticate/authenticate');

router.post('/chat/send-chat',Authenticate.authenticate,chatController.addChat)

module.exports = router;