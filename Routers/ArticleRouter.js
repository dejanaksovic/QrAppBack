const express = require('express');

const { adminAuth } = require("../Middleware/AuthMiddleware");
const { getAllArticles, getArticleById, createArticle, updateArticleById, deleteArticleById } = require("../Controllers/ArticleController");

const router = new express.Router();


// @GET /articles
// Gets all the articles
// []
router.get("/", getAllArticles);
// @GET /articles/{id}
// Gets the article by id
// []
router.get("/:id", getArticleById);
// @POST /articles
// Add a new article
// [ADMIN]
router.post("/", adminAuth, createArticle);
// @PUT /articles/id
// Change article by id
// [ADMIN]
router.patch("/:id", adminAuth, updateArticleById);
// @DELETE /articles/id
// Delte article by id
// [ADMIN]
router.delete("/:id", adminAuth, deleteArticleById);

module.exports = router;