const { create, get, getById, deleteById, updateById } = require("../Repositories/ArticleRepository");
const Response = require("../Responses/Response");

const createArticle = async (req, res) => {
  // Injection
  const response = new Response(res);
  const { name, price } = req.body;

  response.handleResponse(await create(name, price));
}

const getAllArticles = async (req, res) => {
  // Injection
  const response = new Response(res);
  response.handleResponse(await get());
}

const getArticleById = async (req, res)  => {
  // Injection
  const response = new Response(res);
  const { id } = req.params;
  
  response.handleResponse(await getById(id));
}

const updateArticleById = async (req, res) => {
  // Injection
  const response = new Response(res);

  const { id } = req.params;
  const { name, price } = req.body;

  response.handleResponse(await updateById(id, name, price));
}

const deleteArticleById = async (req, res) => {
  // Injection
  const response = new Response(res);
  const { id } = req.params;

  response.handleResponse(await deleteById(id));
}

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  deleteArticleById,
  updateArticleById,
}