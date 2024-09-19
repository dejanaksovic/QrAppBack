const mongoose = require('mongoose');
const User = require("../Models/User");
const QR = require('qrcode');

// STATICS
// TODO: Implement into database
const articlesStatic = require("../Utils/Articles");


const createUser = async (req, res) => {
  const { name, coins } = req.body;
  let user;

  if(!name) {
    return res.status(400).json({
      message: "Korisnik mora imati ime",
    })
  }

  if(coins && (isNaN(Number(coins)) || coins < 0)) {
    return res.status(400).json({
      message: "Nevalidni inicijalni broj poena",
    })
  }

  try {
    user = await User.create({
      Name: name,
      Coins: coins,
    });
    let qr;
    try {
      const selfUrl = process.env.FRONT_URL;
      const idToUrl = `${selfUrl}?id=${user._id}`;
      qr = await QR.toDataURL(idToUrl);
      user.Qr = qr;
      user.save();
    }
    catch(err) {
      return res.status(500).json({
        message: "Unutrasnja greska, kontaktirajte administratora"
      });
    }
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora"
    });
  }

  return res.status(200).json({
    user
  });
}

const getAllUserInfo = async (req, res) => {
  let users;
  try {
    users = await User.find();
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora"
    });
  }

  return res.status(200).json({
    users,
  });
}

const getUserById = async (req, res) => {
  let user;
  const { id } = req.params;
  console.log(id);
  if(!id) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen",
    })
  }
  if(!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen",
    })
  }
  try {
    user = await User.findById(id);
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }

  if(!user)
    return res.status(404).json({
      message: "Korisnik nije pronadjen",
    })

  return res.status(200).json({
    user,
  })
}

const changeUserName = async (req, res) => {
  let user;
  const { id } = req.params;
  const { name } = req.body;
  console.log(req.body);
  if(!id || !mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen"
    })
  }
  if(!name) {
    return res.status(400).json({
      message:"Da biste promenili ime morate postaviti ime",
    })
  }
  try {
    user = await User.findById(id);
    if(!user) {
      return res.status(404).json({
        message: "Korisnik nije pronadjen"
      })
    }
    user.Name = name;
    user.save();
    return res.status(200).json({
      user,
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora"
    })
  }
}

const addOrder = async (req, res) => {
  let user;
  const {id} = req.params;
  const {articlesOrdered} = req.body;

  // Type checking
  if(!articlesOrdered) {
    return res.status(400).json({
      message: "artikli moraju biti dati",
    })
  }
  if(!id) {
    return res.status(404).json({
      message:"Korisnik nije pronadjen",
    })
  }
  // Find user
  if(!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen, pokusajte ponovo"
    })
  }
  try {
    user = await User.findById(id);
    if(!user) {
      return res.status(404).json({
        message: "Korisnik nije pronadjen",
      })
    }
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora"
    })
  }

  // Initial variables
  let coinsToAddCount = 0;
  const transaction = {
    Articles: [],
    Quantities: [],
    Coins: 0,
  }
  // Went wrong flag
  let notValidName = false;
  let notValidQuantity = false;

  // Handle order
  articlesOrdered.forEach(e => {
    // Init check to skip itterations if needed
    if(notValidName || notValidQuantity)
      return;
    // Find article by name
    const orderForTransaction = articlesStatic.find(as => e.name === as.name);
    // Handle not found article
    if(!orderForTransaction) {
      notValidName = true;
      return;
    }
    // Check if quantity is number and handle it
    const quantity = Number(e.quantity);
    if(isNaN(quantity)) {
      notValidQuantity = true;
      return;
    }
    // CHECKS PASS
    transaction.Articles.push(orderForTransaction.name);
    transaction.Quantities.push(quantity);
    coinsToAddCount+= quantity * orderForTransaction.price;
  })
  // Handle not valid article name
  if(notValidName) {
    return res.status(404).json({
      message: "Trazeni artikal nije pronadjen"
    })
  }
  // Handle article quantity not given or not number
  if(notValidQuantity) {
    return res.status(400).json({
      message: "Kvantitet artikala mora biti broj"
    })
  }
  // Add to database and save
  transaction.Coins = coinsToAddCount;
  user.Transactions.push(transaction);
  user.Coins+= coinsToAddCount;
  try {
  await user.save();
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora"
    })
  }
  return res.status(200).json({
    user,
  })
}

const buyWithCoins = async(req, res) => {
  const { id } = req.params;
  const { articlesToBuy } = req.body;

  let user;

  // Check for required values
  if(!articlesToBuy) {
    return res.status(400).json({
      message: "Artikli moraju biti dati"
    })
  }
  if(!id) {
    return res.status(404).json({
      message: "Trazeni korisnik nije pronadjen",
    })
  }
  if(!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen",
    })
  }
  // Find user and handle not found
  try {
    user = await User.findById(id);
    if(!user) {
      return res.status(404).json({
        message: "Korisnik nije pronadjen",
      })
    }
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }

  // Init values
  const transaction = {
    Articles: [],
    Quantities: [],
    Coins: 0,
  }
  let coinsCount = 0;
  let nameNotValid = false;
  let nameNotValidValue = "";
  let quantityNotValid = false;
  let quantityNotValidValue = "";

  articlesToBuy.forEach(e => {
    // Initial checks to skip most of calculation
    if(nameNotValid || quantityNotValid) {
      return;
    }
    const articleForTransaction = articlesStatic.find(as => as.name == e.name);
    // Check and handle name
    if(!articleForTransaction) {
      nameNotValid = true;
      nameNotValidValue = articleForTransaction.name;
      return;
    }
    // Check and handle quantityt
    let quantity = Number(e.quantity);
    if(isNaN(quantity)) {
      quantityNotValid = true;
      quantityNotValidValue = articleForTransaction.quantity;
      return;
    }
    // CHECKS PASS
    transaction.Articles.push(articleForTransaction.name);
    transaction.Quantities.push(quantity);
    coinsCount+= quantity * articleForTransaction.buyPrice;
  })

  // Handle not valid name
  if(nameNotValid){
    return res.status(404).json({
      message: `Artikal ${nameNotValidValue} nije pronadjen`,
    })
  }
  // Handle not valid quantity 
  if(quantityNotValid) {
    return res.status(400).json({
      message: `Kvantitet artikla mora biti broj, ${quantityNotValidValue} nije broj`
    })
  }

  // Validate that user has enough coins
  if(user.Coins - coinsCount < 0) {
    return res.status(400).json({
      message: "Korisnik nema dovoljno sredstava",
    })
  }

  // VALIDATION DONE
  transaction.Coins = coinsCount * (-1);
  user.Coins -= coinsCount;
  user.Transactions.push(transaction);
  try {
    await user.save();
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }
  return res.status(200).json({
    user,
  })
}

const deleteUserById = async(req, res) => {
  const { id } = req.params;

  if(!id || !mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen"
    })
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if(!user) {
      return res.status(404).json({
        messsage: "Korisnik nije pronadjen",
      });
    }
    return res.status(200).json({
      user,
    });
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    });
  }
}

const confirmWorkerPassword = async (req, res) => {
  return res.status(200).end();
}

module.exports = {
  createUser,
  changeUserName,
  getAllUserInfo,
  getUserById,
  addOrder,
  buyWithCoins,
  deleteUserById,
  confirmWorkerPassword,
}