const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/user/addUser', userController.addUser);
router.post('/user/checkUser' , userController.validateUser);

module.exports = router;