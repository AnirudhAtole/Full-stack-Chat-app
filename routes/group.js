const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const Authenticate = require('../authenticate/authenticate');

router.post('/group/create-group',Authenticate.authenticate,groupController.creategroup);
router.get('/user/get-group',Authenticate.authenticate,groupController.getGroups);
router.get('/group/get-members',Authenticate.authenticate,groupController.getUsersAndAdmins);
router.post('/group/add-admin',Authenticate.authenticate,groupController.addAdmin);
router.post('/group/remove-member',groupController.removeMember);
router.post('/group/add-member',Authenticate.authenticate,groupController.addMember);
router.get('/group/get-members-admins/:id',groupController.getUsersAndAdminofGroup);

module.exports = router;