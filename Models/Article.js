const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Price: {
    type: Number,
    require: true,
  }
});

const Article = mongoose.model("Article", articlesSchema);

module.exports = Article;