const CategoryRepository = require("../Repositories/CategoryRepository"); 
const Response = require("../Responses/Response");

const createCategory = async (req, res) => {
  // inject
  const response = new Response(res);
  const { name } = req.body;
  response.handleResponse(await CategoryRepository.create(name));
}

const getCategories = async (req, res) => {
  // Inject
  const response = new Response(res);
  response.handleResponse(await CategoryRepository.get());
}

const getCategoryById = async (req, res) => {
  // Inject
  const response = new Response(res);
  const { id } = req.params;
  response.handleResponse(await CategoryRepository.getById(id));
}

const updateCategory = async (req, res) => {
  // inject
  const response = new Response(res);
  const { id } = req.params;
  const { name } = req.body;

  response.handleResponse(await CategoryRepository.update(id, name));
}

const deleteCategory = async (req, res) => {
  // inject
  const response = new Response(res);
  const { id } = req.params;
  response.handleResponse(await CategoryRepository.deleteById(id));
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}