const QRCode = require("qrcode");
const ErrorType = require("../Responses/ErrorType");
const { writeLog } = require("../Utils/Logger");
const { errorCodes } = require("../Utils/Enums");

const createQR = async (id) => {
  try {
    const qrUrl = await QRCode.toDataURL(id.toString());
    console.log(qrUrl);
    return qrUrl;
  } 
  catch(err) {
    writeLog("ERROR", err);
    return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", {DepErr: "Generating qr"});
  }
}

module.exports = {
  createQR,
}