const express = require('express');
const router = express.Router();
const inviteUserController = require('../controllers/inviteuser');
const Authenticate = require('../authenticate/authenticate');

router.post('/user/send-invite',Authenticate.authenticate ,inviteUserController.sendInvite)
router.get('/user/accept-invite/:uuid', inviteUserController.AcceptInvite)
router.post('/user/addMember/:uuid', inviteUserController.addMember)

module.exports = router;