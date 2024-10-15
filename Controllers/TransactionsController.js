const TransactionRepository = require("../Repositories/TransactionsRepository");
const Response = require("../Responses/Response");

const addTransaction = async (req, res) => {
  // Inject
  const response = new Response(res);
  const { orderToAdd, userId } = req.body;
  const { type } = req.query
  response.handleResponse(await TransactionRepository.create(orderToAdd, userId, type));
}

const getAllTransactions = async (req, res) => {
  // Inject
  const response = new Response(res);
  const { ps, pc, dateStart, dateEnd } = req.query;
  response.handleResponse(await TransactionRepository.get(ps, pc, dateStart, dateEnd));
}

const getUserTransactions = async (req, res) => {
  // Inject
  const { id } = req.params;
  const response = new Response(res);
  response.handleResponse(await TransactionRepository.getByUserId(id));
}

const deleteTransactionById = async(req, res) => {
  // Inject
  const response = new Response(res);
  const { id } = req.params;
  response.handleResponse(await TransactionRepository.deleteById(id));
}

module.exports = {
  addTransaction,
  deleteTransactionById,
  getAllTransactions,
  getUserTransactions,
}