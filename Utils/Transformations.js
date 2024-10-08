const mongoose = require("mongoose");
const ErrorType = require("../Responses/ErrorType");

const validatePagination = (pageStart, pageSlice) => {
  if(pageStart < 0) {
    return new ErrorType(400, "Nevalidan parametar", { pageStart });
  }
  if(pageSlice <= 0) {
    return new ErrorType(400, "Nevalidan parametar", { pageSlice });
  }

  return null;
}

const validateId = (id) => {
  if(!id || !mongoose.isValidObjectId(id)) {
    return new ErrorType(404, "Nije pronadjen", {id});
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

module.exports = {
  validatePagination,
  dateReadableFormat,
  validateId,
}