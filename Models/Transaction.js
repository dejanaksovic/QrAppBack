const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  Order: [
    {
      Article: {
        type: mongoose.Schema.ObjectId,
        ref: "Article",
        require: true,
      },
      Quantity: {
        type: Number,
        require: true,
      }
    }
  ],
  Coins: {
    type: Number,
    require: true,
  }
});

const Transaction = new mongoose.Model("Transaction", transactionSchema);
module.exports = Transaction;