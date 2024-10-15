const mongoose = require('mongoose');
process.env.ENVIROMENT.toUpperCase() == "DEV" ? mongoose.set("debug", true) : null; 

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
      },
    },
  ],
  Coins: {
    type: Number,
    require: true,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;