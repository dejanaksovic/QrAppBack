const express = require('express');

const router = express.Router();

// CONTROLLER
const { deleteUserById, createUser, getAllUserInfo, getUserById, changeUserName, addOrder, buyWithCoins, confirmWorkerPassword } = require('../Controllers/UserController');

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
router.patch('/:id', adminAuth, changeUserName);
// @POST
// Send new order to recieve coins
// [WORKER]
router.post('/order/:id', workerAuth, addOrder);
// @POST
// Send order to buy with coins
// [WORKER]
router.post("/buy/:id", workerAuth, buyWithCoins);
// @DELETE
// Delete user by id
// [ADMIN]
router.delete('/:id', adminAuth, deleteUserById);

// LOGIN ADDONS

// @GET
// Confirm password for worker
// [WORKER]
router.get("/login/worker", workerAuth, confirmWorkerPassword);

module.exports = router;