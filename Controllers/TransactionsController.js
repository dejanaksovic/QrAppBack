const mongoose = require('mongoose');
const User = require("../Models/User");
const Article = require("../Models/Article");
const Transaction = require("../Models/Transaction");

const addTransaction = async (req, res) => {
  let user;
  const order = [];
  let coins = 0;
  const { orderToAdd, userId } = req.body;
  if(!orderToAdd) {
    return res.status(400).json({
      message: "Artikli za tranzakciju moraju biti dati",
    })
  }
  if(!userId || !mongoose.isValidObjectId(userId)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen"
    })
  }
  // Get the user
  try {
    user = await User.findById(userId);
    if(!user) {
      return res.status(404).josn({
        message: "Korisnik nije pronadjen",
      })
    }
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }

  // Check and form order
  if(!Array.isArray(orderToAdd)) {
    return res.status(400).json({
      message: "Nevalidan format porudzbine",
    })
  }

  if(orderToAdd.length === 0) {
    return res.status(400).json({
      message: "Porudzbine prazne",
    })
  }
  let invalidQuatity = false;
  let invalidArticle = false;
  let invalidArticleStatus;
  let serverError;

  for (e of orderToAdd) {
    // Early boundary
    if(invalidArticle || invalidQuatity || serverError)
      return;
    
    let { id, quantity } = e;
    // Checking the validity of arguments
    if(!id) {
      invalidArticle = true;
      invalidArticleStatus = 400;
      return;
    }
    if(!quantity) {
      invalidQuatity = true;
      return;
    }

    if(!mongoose.isValidObjectId(id)) {
      invalidArticle = true;
      invalidArticleStatus = 404;
      return;
    }

    quantity = Number(quantity);
    if(isNaN(quantity) || quantity <= 0) {
      invalidQuatity = true;
      return;
    }
    // Check if artical exists in db
    try {
      const article = await Article.findById(id);
      if(!article) {
        invalidArticle = true;
        invalidArticleStatus = 404;
        return;
      }
      coins += quantity * article.Price / 10;
    }
    catch(err) {
      serverError = true;
      return;
    }
    // If all checks pass populate order
    console.log("Pushing");
    order.push({
      Article: id,
      Quantity: quantity,
    })
  }
  if(invalidArticle) {
    return res.status(invalidArticleStatus).json({
      message: invalidArticleStatus === 400 ? "Artikal nije dat" : "Artikal nije pronadjen",
    })
  }
  if(invalidQuatity) {
    return res.status(400).json({
      message: "Kolicina artikala mora biti broj veci od 0",
    })
  }
  if(serverError) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }
  try {
    const transaction = await Transaction.create({
      User: userId,
      Order: order,
      Coins: coins,
    });
    user.Coins+= coins;
    user.save();
    return res.status(201).json({
      transaction
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora"
    })
  }
}

module.exports = {
  addTransaction,
}