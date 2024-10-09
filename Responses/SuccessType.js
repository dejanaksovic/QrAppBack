class SuccessType {
  constructor(status, objToSend ) {
    if(!status || status > 400 || status < 100 ) {
      throw Error("Resposne type must have status in range [100, 400)");
    }
    if(!objToSend) {
      throw Error("Response type must have object to respond with");
    }

    this.status = status;
    this.objToSend = objToSend;
  }
}

module.exports = SuccessType;