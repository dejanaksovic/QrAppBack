const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
  }
})

const categoryModel = new mongoose.model("Category", categorySchema);

module.exports = categoryModel;