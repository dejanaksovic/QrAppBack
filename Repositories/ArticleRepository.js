const Article = require("../Models/Article");
const ErrorType = require("../Responses/ErrorType");
const { writeLog } = require("../Utils/Logger");
const { validatePagination, validateId } = require("../Utils/Transformations");

// VALIDATION RETURNS NULL FOR SEMANTIC GYMNASTICS
const validateName = (name) => {
  console.log("inside");
  if(!name)
    return new ErrorType(400, "Neophodan parametar", {name});
  return null
}

const validatePrice = (price) => {
  price = Number(price);
  if(!price) {
    return new ErrorType(400, "Neophodan parametar", {price});
  }
  if(isNaN(price) || price <= 0) {
    return new ErrorType(400, "Cena mora biti broj veci od 0", {price});
  }

  return null;
}

// TODO: IMPLEMENT CATEGORIES
const create = async (name, price, category) => {
  const status = validateName(name) || validatePrice(price);
  if(status) {
    return status;
  }

  try {
    const article = await Article.create({
      Name: name,
      Price: price,
    })
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja greska", {DbErr: "Greska pri radu sa bazom"});
  }
}

const getById = async (id) => {
  const status = validateId(id);
  if(status) {
    return new ErrorType(404, "Nije pronadjen artikal", {id});
  }
  try {
    const article = await Article.findById();
    if(!article) {
      return new ErrorType(404, "Artikal nije pronadjen", {id});
    }
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja greska", {DbErr: "Connection problem"});
  }
}

const updateById = async (id, name, price) => {
  console.log(name);
  const validationErr = validateId(id) || name ? validateName(name) : null || price ? validatePrice(price) : null;
  if(validationErr) {
    return validationErr;
  }
  try {
    const article = await Article.findByIdAndUpdate(id, {
      ...(name && {Name: name}),
      ...(price && {Price: price}),
    }, {new: true});
    if(!article) {
      return new ErrorType(404, "Artikal nije pronadjen", {id});
    }
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja grska", {DbErr: "Changing problem"});
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
      return new ErrorType(404, "Artikal nije pronadjen", {id});
    }
    return article;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(400, "Unutrasnja greska", {DbErr: "Deletion error"});
  }
}

const get = async (ps, pc) => {
  const paginationError = validatePagination(ps, pc);
  if(paginationError) {
    return paginationError;
  }
  try {
    const articles = await Article.find().limit(pc).skip(ps*pc);
    return articles;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(500, "Unutrasnja grska", {DbErr: "Fetching error"});
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