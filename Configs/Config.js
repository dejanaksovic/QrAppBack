const mongoose = require('mongoose');

const connectDB = async (connString) => {
  try {
    mongoose.connect(connString);
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = connectDB;