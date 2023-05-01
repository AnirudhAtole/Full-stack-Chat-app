const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const Authenticate = require('../authenticate/authenticate');

router.post('/group/create-group',Authenticate.authenticate,groupController.creategroup);
router.get('/user/get-group',Authenticate.authenticate,groupController.getGroups);
router.get('/group/get-users',groupController.getUsers);
router.get('/chats/group-chats',groupController.getGroupChats);

module.exports = router;