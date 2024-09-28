const express = require('express');

const router = express.Router();

const { confirmWorkerLogin, confirmAdminLogin } = require("../Controllers/SessionController");

// @POST /sessions/worker
// Confirm login as a worker
// []
router.post('/worker', confirmWorkerLogin);
// @POST /sessions/admin
// Confirm login as admin;
// []
router.post("/admin", confirmAdminLogin);

module.exports = router;