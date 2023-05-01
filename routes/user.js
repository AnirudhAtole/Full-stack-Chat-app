const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const Authenticate = require('../authenticate/authenticate');

router.post('/user/addUser', userController.addUser);
router.post('/user/checkUser' , userController.validateUser);
router.get('/user/showMembers',Authenticate.authenticate , userController.showMembers);

module.exports = router;