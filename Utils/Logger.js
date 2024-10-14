const fs = require('fs');
const { dateReadableFormat } = require('./Transformations');

const writeLog = (type, error) => {
  const date = new Date();

  // Assert types
  if(!["error", "success", "warning"].includes(type.toLowerCase())) {
    throw Error("Loggin type not valid");
  }

  const message = `${dateReadableFormat(date)} // ${type.toUpperCase()}: ${error.message} // ${error.stack}\n`;

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