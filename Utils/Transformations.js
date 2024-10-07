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

module.exports = {
  validatePagination,
}