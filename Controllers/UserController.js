const UserRepository = require("../Repositories/UserRepository");
const Response = require('../Responses/Response');


const createUser = async (req, res) => {
  const response = new Response(res);
  const { name, coins } = req.body;
  
  return response.handleResponse(await UserRepository.addUser(name, coins));
}

const getAllUserInfo = async (req, res) => {
  // Page start, page count
  let { ps, pc, nameFilter } = req.query;
  // inject
  const response = new Response(res);

  response.handleResponse(await UserRepository.getPaginated(ps, pc, nameFilter));
  
}

const getUserById = async (req, res) => {
  const { id } = req.params;
  // Inject
  const response = new Response(res);

  return response.handleResponse(await UserRepository.getUserById(id));
}

const changeUser = async (req, res) => {
  const { id } = req.params;
  // inject
  const response = new Response(res);
  response.handleResponse(await UserRepository.updateUserById(id, req.body));
}

const deleteUserById = async(req, res) => {
  const { id } = req.params;
  // inject
  const response = new Response(res);

  response.handleResponse(await UserRepository.deleteUserById(id));
}

module.exports = {
  createUser,
  changeUser,
  getAllUserInfo,
  getUserById,
  deleteUserById,
}