const Article = require("../Models/Article");
const ErrorType = require("../Responses/ErrorType");
const CategoryRepository = require("../Repositories/CategoryRepository");
const { writeLog } = require("../Utils/Logger");
const { validatePagination, validateId } = require("../Utils/Transformations");
const { errorCodes } = require("../Utils/Enums");

// VALIDATION RETURNS NULL FOR SEMANTIC GYMNASTICS
const validateName = (name) => {
  if(!name)
    return new ErrorType(errorCodes.UserError, "Neophodan parametar", {name});
  return null
}

const validatePrice = (price) => {
  price = Number(price);
  if(!price) {
    return new ErrorType(errorCodes.UserError, "Neophodan parametar", {price});
  }
  if(isNaN(price) || price <= 0) {
    return new ErrorType(errorCodes.UserError, "Cena mora biti broj veci od 0", {price});
  }

  return null;
}

const validateCategory = async (categoryId) => {
  const validationError = validateId(categoryId);
  if(validationError) {
    return validationError;
  }
  const categoryError = await CategoryRepository.getById(categoryId);
  if(categoryError instanceof ErrorType) {
    return categoryError;
  }
  return null;
}

// TODO: IMPLEMENT CATEGORIES
const create = async (name, price, categoryId) => {
  const status = validateName(name) || validatePrice(price) || await validateCategory(categoryId);
  console.log(status);
  if(status) {
    return status;
  }

  try {
    const article = await Article.create({
      Name: name,
      Price: price,
      Category: categoryId,
    })
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", {DbErr: "Greska pri radu sa bazom"});
  }
}

const getById = async (id) => {
  const status = validateId(id);
  if(status) {
    return new ErrorType(errorCodes.NotFound, "Nije pronadjen artikal", {id});
  }
  try {
    const article = await Article.findById(id);
    if(!article) {
      return new ErrorType(errorCodes.NotFound, "Artikal nije pronadjen", {id});
    }
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.NotFound, "Unutrasnja greska", {DbErr: "Connection problem"});
  }
}

const updateById = async (id, name, price, categoryId) => {
  const validationErr = validateId(id) || name ? validateName(name) : null || price ? validatePrice(price) : null || categoryId ? validateCategory(categoryId) : null;
  if(validationErr) {
    return validationErr;
  }
  try {
    const article = await Article.findByIdAndUpdate(id, {
      ...(name && {Name: name}),
      ...(price && {Price: price}),
    }, {new: true});
    if(!article) {
      return new ErrorType(errorCodes.NotFound, "Artikal nije pronadjen", {id});
    }
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "Unutrasnja grska", {DbErr: "Changing problem"});
  }
}

const deleteById = async(id) => {
  const validationErr = validateId(id);
  if(validationErr) {
    return validationErr;
  }
  try {
    const article = await Article.findByIdAndDelete(id);
    if(!article) {
      return new ErrorType(errorCodes.NotFound, "Artikal nije pronadjen", {id});
    }
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", {DbErr: "Deletion error"});
  }
}

const get = async (ps, pc, categoryId) => {
  // Default ps, and pc
  ps = ps ?? 0;
  pc = pc ?? 5;
  const parameterError = validatePagination(ps, pc) || categoryId ? await validateCategory(categoryId) : null;
  if(parameterError) {
    return parameterError;
  }
  try {
    const articles = await Article.find({
      ...(categoryId ? {Category: categoryId} : null)
    }).limit(pc).skip(ps*pc);
    return articles;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "Unutrasnja grska", {DbErr: "Fetching error"});
  }
}

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
  getById,
  get,
}