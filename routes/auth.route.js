const express = require('express');
const { registerUser,signInUser } = require('../controllers/auth.controller');
const { userList,createUser,updateUser, getUser ,deleteUser} = require('../controllers/user.controller');
const {middleWare} = require("../util/middleware");
const router = express.Router();

// Registration route
router.post('/sign-up', registerUser);
// Signin route
router.post('/sign-in', signInUser);

// user api
router.post('/user/listing',middleWare, userList);
router.post('/user/create',middleWare, createUser);
router.put('/user/update/:id',middleWare, updateUser);
router.get('/user/:id',middleWare, getUser);
router.delete('/user/delete/:id',middleWare, deleteUser);

module.exports = router;