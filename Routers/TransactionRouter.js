const express = require('express');
const router = express.Router();

const { addTransaction } = require("../Controllers/TransactionsController");

// @POST /transactions/add
// Add a new transaction for adding to the balance
// [WORKER]
router.post("/add", addTransaction);
// @POST /transactions/remove
// Add a new transaction for removing from the balance
// [WORKER]
router.post("/remove");

module.exports = router;