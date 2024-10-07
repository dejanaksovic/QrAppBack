const ErrorType = require("./ErrorType");

class Response {
  constructor(response) {
    this.response = response;
  }

  handleError(error) {
    if(!(error instanceof ErrorType)) {
      throw Error("Error must be instane of ErrorType");
    }
    // Format 
    return this.response.status(error.status).json({
      message: error.message,
      massageExtended: error.keyValues,
    })
  }

  // TODO: TRY IMPLEMENTING SUCCESS TYPE
  handleSucces(status, objToSend) {
    this.response.status(status).json({
      objToSend,
    })
  }

  handleResponse(obj) {
    if(obj instanceof ErrorType) {
      return this.handleError(obj);
    }
    return this.handleSucces(200, obj);
  }
}

module.exports = Response;