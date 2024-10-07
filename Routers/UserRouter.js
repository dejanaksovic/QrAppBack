const express = require('express');

const router = express.Router();

// CONTROLLER
const { deleteUserById, createUser, getAllUserInfo, getUserById, changeUser } = require('../Controllers/UserController');

// MIDDLEWARE
const { adminAuth, workerAuth } = require('../Middleware/AuthMiddleware')

// @GET
// Get all users, and their info
// [ADMIN]
router.get('/', adminAuth, getAllUserInfo);
// @GET
// Get user with specified id
// []
router.get('/:id', getUserById);
// @POST
// Create a new user
// [ADMIN]
router.post('/', adminAuth, createUser);
// @PATCH
// Change user name
// [ADMIN]
router.patch('/:id', adminAuth, changeUser);
// @DELETE
// Delete user by id
// [ADMIN]
router.delete('/:id', adminAuth, deleteUserById);

module.exports = router;