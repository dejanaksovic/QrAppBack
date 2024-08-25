const { default: mongoose } = require("mongoose");
const User = require("../Models/User");
const QR = require('qrcode');

const createUser = async (req, res) => {
  const { name, balance } = req.body;
  let user;

  if(!name) {
    return res.status(400).json({
      message: "Korisnik mora imati ime",
    })
  }

  if(!balance || balance < 0) {
    return res.status(400).json({
      message: "Invalid balance value",
    })
  }

  try {
    user = await User.create({
      Name: name,
      Balance: balance,
    });
    let qr;
    try {
      const selfUrl = process.env.FRONT_URL;
      const idToUrl = `${selfUrl}/worker?id=${user._id}`;
      qr = await QR.toDataURL(idToUrl);
      user.Qr = qr;
      user.save();
    }
    catch(err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error, contact administrator"
      });
    }
  }
  catch(err) {
    return res.status(500).json({
      message: "Internal error, contact administrator"
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

const changeUserBalance = async (req, res) => {
  let user;
  const {id} = req.params;
  const {balance} = req.body;

  // ERROR HANDLING FOR BALANCE
  if(isNaN(Number(balance))) {
    console.log(req.body);
    return res.status(400).json({
      message: "Nevalidna vrednost sredstava koji se dodaju ili oduzimaju",
    })
  }

  // Id checking
  if(!id || !mongoose.isValidObjectId(id)) {
  return res.status(404).json({
      message: "User not found",
    })
  }

  try {
    user = await User.findById(id);
  }
  catch(err) {
    res.status(500).json({
      message: "unutrasnja greska, kontaktirajte administratora",
    })
    console.log(err);
  }

  if(!user)
    return res.status(404).json({
      message: "User not found",
    })

  // Inssuficient funds case
  if(Number(user.Balance) + Number(balance) < 0) {
    return res.status(400).json({
      message: "Inssuficcient funds",
    })
  }

  // Catch for non number balance values
  try {
    // Saving only 5 last transactions
    if(user.Transactions.length > 4) {
      const a = user.Transactions.shift();
      console.log(`Popped ${a}`);
    }
    user.Balance = Number(user.Balance) + Number(balance);
    user.Transactions.push(balance);
    user.save();
  }
  catch(err) {
    return res.status(400).json({
      message: "Parameter values not fit",
    })
  }

  return res.status(200).json({
    user
  })
}

const deleteUserById = async(req, res) => {
  const { id } = req.params;

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
    console.log(err);
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    });
  }
}

module.exports = {
  createUser,
  getAllUserInfo,
  getUserById,
  changeUserBalance,
  deleteUserById,
}