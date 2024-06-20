const express = require('express');
const { registerUser,signInUser } = require('../controllers/auth.controller');
const { userList } = require('../controllers/user.controller');
const {middleWare} = require("../util/middleware");
const router = express.Router();

// Registration route
router.post('/sign-up', registerUser);
// Signin route
router.post('/sign-in', signInUser);

// user api
router.post('/user/listing',middleWare, userList);

module.exports = router;