class ErrorType {
  constructor(status, message, keyValues) {
    if(!status)
      throw Error("Error type must have a status");
    if(isNaN(Number(status)) || status < 400 || status > 600)
      throw Error("Error status must be a number in range [400, 600)");
    if(!keyValues)
      throw Error("Error must have keyvalues");
    if(!message)
    console.log(status);
    this.status = status;
    this.message = message;
    this.keyValues = "";
    // Formating as string
    for(let [key, value] of Object.entries(keyValues)) {
      this.keyValues += `${key} ${value}\n`;
    }
  }
}

module.exports = ErrorType;