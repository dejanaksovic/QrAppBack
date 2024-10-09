const fs = require('fs');
const { dateReadableFormat } = require('./Transformations');

const chechkForLogPath = () => {
  if(fs.existsSync("./Logs/state.log"))
    return true;
  return false;
}

const writeLog = (type, error) => {
  const date = new Date();

  // Assert types
  if(!["error", "success", "warning"].includes(type.toLowerCase())) {
    throw Error("Loggin type not valid");
  }

  const message = `${dateReadableFormat(date)} // ${type.toUpperCase()}: ${error.message}\n`;

  try {
    fs.appendFileSync("./Logs/state.log", message);
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = {
  writeLog,
}