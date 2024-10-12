const express = require('express');

const { adminAuth } = require("../Middleware/AuthMiddleware");
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../Controllers/CategoryController");

const router = new express.Router();

// @GET /categories/
// Returns all categories
// [ADMIN]
// RETURN TYPE [ {id, name} ]
router.get("/", adminAuth, getCategories);

// @GET /categories/id
// Returns categry with given id
// [ADMIN]
// RETURN TYPE {id, name}
router.get("/:id", getCategoryById);

// @POST /categories
// Creates a new category
// BODY {name};
// [ADMIN]
// RETURN TYPE {id, name}
router.post("/", createCategory);

// @PATCH /categories/id
// Updates and returns category with id
// BODY {name}
// [ADMIN]
// RETURN TYPE {id, name}(new)
router.patch("/", updateCategory);

// @DELETE /categories/id
// Deletes category with given id
// [ADMIN]
// RETURN TYPE {id, name}(deleted)
router.delete("/:id", deleteCategory);

module.exports = router;


