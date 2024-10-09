const ErrorType = require("./ErrorType");
const SuccessType = require("./SuccessType");

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
  handleSucces(success) {
    if(!(success instanceof SuccessType)) {
      throw Error("Success response must be of type SuccessType");
    }
    this.response.status(success.status).json({
      res: success.objToSend,
    })
  }

  handleResponse(obj) {
    if(obj instanceof ErrorType) {
      return this.handleError(obj);
    }
    if(obj instanceof SuccessType) {
      return this.handleSucces(obj);
    }
    return this.response.status(200).json({
      res: obj,
    })    
  }
}

module.exports = Response;