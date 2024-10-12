const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Price: {
    type: Number,
    require: true,
  },
  Category: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Category",
  }
});

const Article = mongoose.model("Article", articlesSchema);

module.exports = Article;