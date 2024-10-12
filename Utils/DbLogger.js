const fs = require('fs');
const { dateReadableFormat } = require('./Transformations');

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
  const logFormat = `${dateReadableFormat(logDate)} // ${log.message}`
  try {
    fs.appendFileSync("./logs/db.log", `${logFormat}\n`);
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = {
  writeLog,
}