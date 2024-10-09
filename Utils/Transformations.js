const ErrorType = require("../Responses/ErrorType");

const validatePagination = (pageStart, pageSlice) => {
  if(pageStart < 0) {
    return new ErrorType(400, "Nevalidan parametar", { pageStart });
  }
  if(pageSlice <= 0) {
    return new ErrorType(400, "Nevalidan parametar", { pageSlice });
  }

  return true;
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
}