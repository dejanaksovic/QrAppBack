const fs = require('fs');

const checkForLogFile = (logName) => {
  try {
    fs.accessSync();
    return true;
  }
  catch(err) {
    return false;
  }
}

const writeLog = (type, log) => {
  const logDate = new Date();
  const logForma = `${newDat}`
  try {
    fs.appendFileSync("./logs/db.log", `${log}`);
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = {
  writeLog,
}