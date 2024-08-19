const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: String,
  Balance: Number,
  Qr: String,
  Transactions: [Number],
});

const User = mongoose.model('User', userSchema);

module.exports = User;