const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Coins: {
    type: Number,
    default: 0,
  },
  Qr: String,
  Transactions: [Number],
});

const User = mongoose.model('User', userSchema);

module.exports = User;