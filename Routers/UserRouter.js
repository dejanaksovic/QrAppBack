const express = require('express');

const router = express.Router();

// CONTROLLER
const { deleteUserById, createUser, getAllUserInfo, getUserById, changeUserBalance } = require('../Controllers/UserController');

// MIDDLEWARE
const { adminAuth, workerAuth } = require('../Middleware/AuthMiddleware')

router.get('/', adminAuth, getAllUserInfo);
router.get('/:id', getUserById);
router.post('/', adminAuth, createUser);
router.post('/:id', workerAuth, changeUserBalance);
router.delete('/:id', adminAuth, deleteUserById);

module.exports = router;