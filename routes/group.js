const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const Authenticate = require('../authenticate/authenticate');

router.post('/group/create-group',Authenticate.authenticate,groupController.creategroup);
router.get('/user/get-group',Authenticate.authenticate,groupController.getGroups);
router.get('/group/get-users',groupController.getUsers);
router.add('/group/add-admin',Authenticate.authenticate,groupController.addAdmin);
router.get('/group/get-admins',groupController.getAdmins);

module.exports = router;