const Category = require("../Models/Category");
const ErrorType = require("../Responses/ErrorType");
const { writeLog } = require("../Utils/Logger");
const { validateId } = require("../Utils/Transformations");
const { errorCodes } = require("../Utils/Enums")

const validateName = (name) => {
  if(!name) {
    return new ErrorType(400, "A", {name});
  }

  return null;
}

const get = async () => {
  try {
    const categories = await Category.find();
    return categories;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "S", {DbErr: "Gettin all"});
  }
}

const create = async (name) => {
  const nameError = validateName(name);
  if(nameError) {
    return nameError;
  }
  try {
    const category = await Category.create({
      Name: name,
    })
    return category;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "S", {DbErr: "Creating"});
  }
}

const update = async (id, name) => {
  const validationError = validateId(id) || validateName(name);
  if(validationError) {
    return validationError;
  }

  try {
    const category = await Category.findByIdAndUpdate(id, {Name: name});
    if(category) {
      return new ErrorType(errorCodes.NotFound, "S", {id});
    }
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "S", {DbErr: "A"});
  }
}

const deleteById = async(id) => {
  const validationError = validateId(id);
  if(validationError) {
    return validationError;
  } 
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if(!deletedCategory){
      return new ErrorType(errorCodes.NotFound, "S", {id});
    } 
    return deletedCategory;
  }
  catch(err) {
    writeLog("ERR", err);
    return new ErrorType(errorCodes.InteralError, "S", {DbErr: "Deleting"});
  }
}

const getById = async(id) => {
  const validationError = validateId(id);
  if(validationError) {
    return validationError;
  }
  try {
    const category = await Category.findById(id);
    if(!category) {
      return new ErrorType(errorCodes.NotFound, "S", {id});
    }
    return category;
  }
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "S", {DbErr: "Getting single"});
  }
}

module.exports = {
  get,
  create,
  update,
  deleteById,
  getById,
}