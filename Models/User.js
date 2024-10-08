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
  Transactions: {
    type: [{
      Date: {
        type: Date,
        default: new Date(),
      },
      Articles: {
        type: [String],
        require: true,
      },
      Quantities: {
        type: [Number],
        require: true,
      },
      Coins: {
        type: Number,
        require: true,
      }
    }],
    default:[], 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;