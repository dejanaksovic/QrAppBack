const express = require('express');
const router = express.Router();

const { addTransaction, deleteTransactionById, getAllTransactions, getUserTransactions } = require("../Controllers/TransactionsController");
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
router.post("/", workerAuth, addTransaction);
// @POST /transactions/remove
// Add a new transaction for removing from the balance
// [WORKER]
router.delete("/", workerAuth, deleteTransactionById);

module.exports = router;