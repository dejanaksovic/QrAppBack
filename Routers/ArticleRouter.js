const express = require('express');

const { adminAuth } = require("../Middleware/AuthMiddleware");
const { getAll, getById, createArticle, updateArticle, deleteArticle } = require("../Controllers/ArticleController");

const router = new express.Router();


// @GET /articles
// Gets all the articles
// []
router.get("/", getAll);
// @GET /articles/{id}
// Gets the article by id
// []
router.get("/:id", getById);
// @POST /articles
// Add a new article
// [ADMIN]
router.post("/", adminAuth, createArticle);
// @PUT /articles/id
// Change article by id
// [ADMIN]
router.put("/:id", adminAuth, updateArticle);
// @DELETE /articles/id
// Delte article by id
// [ADMIN]
router.delete("/:id", adminAuth, deleteArticle);

module.exports = router;