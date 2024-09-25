const express = require('express');

const { adminAuth } = require("../Middleware/AuthMiddleware");
const { getAll, getById, createArticle, updateArticle, deleteArticle } = require("../Controllers/ArticleController");

const router = new express.Router();


// @GET /articles
// Gets all the articles
// []
router.get("/", getAll);
// @POST /articles
// Add a new article
// [ADMIN]
router.post("/", createArticle);
// @POST /articles/id
// Change article by id
// [ADMIN]
router.post("/:id", updateArticle);
// @DELETE /articles/id
// Delte article by id
// [ADMIN]
router.delete("/:id", deleteArticle);

module.exports = router;