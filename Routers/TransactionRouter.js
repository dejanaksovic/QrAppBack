const express = require('express');
const router = express.Router();

const { addTransaction, removeOrder, getAllTransactions, getUserTransactions } = require("../Controllers/TransactionsController");
const { workerAuth } = require("../Middleware/AuthMiddleware");

// @GET /transactions
// Gets all the transactions
// []
router.get("/", getAllTransactions);
// @GET /transactions/{id}
// Get transactions of a single user
router.get("/:id", getUserTransactions);
// @POST /transactions/add
// Add a new transaction for adding to the balance
// [WORKER]
router.post("/add", workerAuth, addTransaction);
// @POST /transactions/remove
// Add a new transaction for removing from the balance
// [WORKER]
router.post("/remove", workerAuth, removeOrder);

module.exports = router;