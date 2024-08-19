const express = require('express');

const router = express.Router();

const {deleteUserById, createUser, getAllUserInfo, getUserById, changeUserBalance } = require('../Controllers/UserController');

router.get('/', getAllUserInfo);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/:id', changeUserBalance);
router.delete('/:id', deleteUserById);

module.exports = router;