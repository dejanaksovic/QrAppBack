const UserRepository = require("../Repositories/UserRepository");
// NAMING
const ArticleRepository = require("../Repositories/ArticleRepository");
const ErrorType = require("../Responses/ErrorType");
const Transaction = require("../Models/Transaction");
const { writeLog } = require("../Utils/Logger");
const { validateId } = require("../Utils/Transformations");

const validateType = (type) => {
  if(!type) {
    return new ErrorType(400, "Tranzakcija mora imati tip", {type});
  }
  if(!["add", "remove"].includes(type)) {
    return new ErrorType(400, "Nevalidan tip tranzaksije", {type});
  }

  return null;
}

const validateOrderItemAndReturnCoins = async (orderItem) => {
  // Article part
  let { articleId, quantity } = orderItem;
  quantity = Number(quantity);
  const article = await ArticleRepository.getById(articleId);
  if(article instanceof ErrorType) {
    return article;
  }
  // Quantity part
  if(!quantity) {
    return new ErrorType(400, "Neophodan parametar", {quantity});
  }
  if(isNaN(quantity) || quantity <= 0) {
    return new ErrorType(400, "Kvantitet mora biti broj veci od nule", {quantity});
  }
  // checks pass
  return article.Price * quantity;
}

const validateOrderItems = async (order) => {
  if(!order)
    return new ErrorType(400, "Items for order not found", {orderItem});
  if(!Array.isArray(order)) {
    return new ErrorType(400, "Nevalidni tip narudzbenica, mora biti niz", {orderItem})
  }
  // QUESTION ?? Exctract coins calculation
  let coins = 0;

  for(let orderItem of order) {
    const validationErrorOrCoins = await validateOrderItemAndReturnCoins(orderItem);
    if(validationErrorOrCoins instanceof ErrorType) {
      return validationErrorOrCoins;
    }
    coins += validationErrorOrCoins;
  }

  return coins;
}

const validateOrder = async (orderToAdd, userId, type) => {
  const validationErrorOrUser = await UserRepository.getUserById(userId);
  if(validationErrorOrUser instanceof ErrorType) {
    return validationErrorOrUser;
  }
  const validationErrorOrCoins = await validateOrderItems(orderToAdd);
  if(validationErrorOrCoins instanceof ErrorType) {
    return validationErrorOrCoins;
  }

  const typeValidationError = validateType(type);
  if(typeValidationError) {
    return typeValidationError;
  }
  // HIGHER ORDER AGAIN
  if(type === "remove" && validationErrorOrUser.Coins - validationErrorOrCoins < 0) {
    return new ErrorType(400, "Nedovoljno sredstava", {
      UserCoins: validationErrorOrUser.Coins,
      RequestedCoins: validationErrorOrCoins
    })
  }

  return [validationErrorOrCoins, validationErrorOrUser];
}

const transformOrder = (orderItems) => {
  console.log(orderItems);
  const orderFormat = [];
  for(let item of orderItems) {
    orderFormat.push({
      Article: item.articleId,
      Quantity: Number(item.quantity),
    })
  }
  return orderFormat;
}

// QUESTION ?? Another composite line of validation
const create = async (orderToAdd, userId, type) => {
  // LMAO NAMING
  const validateOrderErrorOrCoinsUser = await validateOrder(orderToAdd, userId, type);
  if(validateOrderErrorOrCoinsUser instanceof ErrorType) {
    return validateOrderErrorOrCoinsUser;
  }
  // Checks pass user and coins must be sent
  const [coins, user] = validateOrderErrorOrCoinsUser;
  console.log(coins);
  // Actuall saving to db
  // QUESTION ?? COMPOSITE AGAIN, HIGHER ORDER PRINCIPLE
  try {
    const transaction = await Transaction.create({
      User: userId,
      Order: transformOrder(orderToAdd),
      Coins: coins/10,
    })
    const userError = UserRepository.updateUserById(userId, type.toLowerCase() === "add" ? {coins: user.Coins + coins} : {coins: user.Coins - coins}); 
    if(userError instanceof ErrorType) {
      return userError;
    }
    return transaction;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja greska", {DbErr: "Creating"});
  }
}

const getByUserId = async (userId) => {
  const validationError = validateId(id);
  if(validateId) {
    return validationError;
  }
  try {
    const transaction = await Transaction.findBy({User: id});
    if(!transaction) {
      return new ErrorType(404, "Tranzakcija nije pronadjena", {id});
    }
    return transaction;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja greska", {DbErr: "Deletion"})
  }
}

const deleteById = async(id) => {
  const validationError = validateId(id);
  if(validationError) {
    return validationError;
  }

  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if(!transaction) {
      return new ErrorType(404, "Tranzakcija nije pronadjena", {id});
    }
    return transaction;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja grska", {DbErr: "Deletion"})
  }
}

const get = async (ps, pc) => {
  // Default pagination
  ps = ps ?? 0;
  pc = pc ?? 5;

  try {
    const transactions = await Transaction.find().limit(pc).skip(pc*ps);
    return transactions;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja greska", {DbErr: "Fetching"});
  }
}

module.exports = {
  create,
  getByUserId,
  deleteById,
  get,
}