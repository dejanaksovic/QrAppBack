const mongoose = require("mongoose");
const ErrorType = require("../Responses/ErrorType");
const { errorCodes } = require("../Utils/Enums");

const validatePagination = (pageStart, pageSlice) => {
  if(pageStart < 0) {
    return new ErrorType(errorCodes.UserError, "Nevalidan parametar", { pageStart });
  }
  if(pageSlice <= 0) {
    return new ErrorType(errorCodes.UserError, "Nevalidan parametar", { pageSlice });
  }

  return null;
}

const validateId = (id) => {
  if(!id || !mongoose.isValidObjectId(id)) {
    return new ErrorType(errorCodes.NotFound, "Nije pronadjen", {id});
  }

  return null;
}

const dateReadableFormat = (date) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const day = date.getHours();
  const month = date.getMonth();
  
  return `${month}.${day} ${hours}:${minutes}`;
}

const validateDate = (date) => {
  if(!date) {
    return new ErrorType(400, "Mora postojati", {date});
  }
  const testDate = new Date(date);
  if(isNaN(testDate)) {
    return new ErrorType(400, "Nevalidan format", {date});
  }
  return testDate;
}

module.exports = {
  validatePagination,
  dateReadableFormat,
  validateId,
  validateDate,
}