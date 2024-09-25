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
    let { id, quantity } = e;
    // Checking the validity of arguments
    if(!id) {
      return res.status(400).json({
        message: "Artikal nije dat",
      })
    }
    if(!quantity) {
      return res.status(400).json({
        message: "Kvantitet nije dat",
      })
    }

    if(!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        message: "Artikal ne postoji"
      })
    }

    quantity = Number(quantity);
    if(isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Nevalidna vrednost kvantiteta",
      })
    }
    // Check if artical exists in db
    try {
      const article = await Article.findById(id);
      if(!article) {
        return res.status(404).json({
          message: "Artikal nije pronadjen",
        })
      }
      coins += quantity * article.Price / 10;
    }
    catch(err) {
      return res.status(500).json({
        message: "Unutrasnja greska, kontaktirajte administratora",
      })
    }
    // If all checks pass populate order
    order.push({
      Article: id,
      Quantity: quantity,
    })
  }
  try {
    const transaction = await Transaction.create({
      User: userId,
      Order: order,
      Coins: coins,
    });
    user.Coins+= coins;
    await user.save();
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

const removeOrder = async (req, res) => {
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
  for (e of orderToAdd) {
   
    let { id, quantity } = e;
    // Checking the validity of arguments
    if(!id) {
      return res.status(400).json({
        message: "Artikal nije dat",
      })
    }
    if(!quantity) {
      return res.status(400).json({
        message: "Kvantitet nije dat",
      });
    }

    if(!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        message: "Artikal nije pronadjen",
      })
    }

    quantity = Number(quantity);
    if(isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Kvantitet nevalidan"
      });
    }

    // Check if artical exists in db
    try {
      const article = await Article.findById(id);
      if(!article) {
        return res.status(404).json({
          message: "Artikal nije pronadjen",
        })
      }
      coins += quantity * article.Price;
      if(user.Coins < coins) {
        return res.status(400).json({
          message: "Nedovoljno sredstava",
        })
      }
    }
    catch(err) {
      return res.status(500).json({
        message: "Unutrasnja greska, kontaktirajte administratora",
      })
    }

    // If all checks pass populate order
    order.push({
      Article: id,
      Quantity: quantity,
    })
  }

  try {
    const transaction = await Transaction.create({
      User: userId,
      Order: order,
      Coins: coins * -1,
    });
    user.Coins-= coins;
    await user.save();
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

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({
      transactions,
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasanj greska, kontaktirajte administratora",
    })
  }
}

const getUserTransactions = async (req, res) => {
  const { id } = req.params;
  if(!id || !mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen",
    })
  }
  try {
    const transactions = await Transaction.find({
      User: id,
    })
    return res.status(200).json({
      transactions,
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
  removeOrder,
  getAllTransactions,
  getUserTransactions,
}