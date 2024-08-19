const User = require("../Models/User");
const QR = require('qrcode');

const createUser = async (req, res) => {
  const { name, balance } = req.body;
  let user;

  if(!balance || balance < 0) {
    console.log(balance);
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
      const selfUrl = process.env.SELF_URL;
      const idToUrl = `${selfUrl}/users/${user._id}`;
      qr = await QR.toDataURL(idToUrl);
      user.Qr = qr;
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

  try {
    user = await User.findById(id);
  }
  catch(err) {
    res.status(500).json({
      message: "unutrasnja greska, kontaktirajte administratora",
    })
  }

  if(!user)
    return res.status(404).json({
      message: "User not found",
    })

  // Inssuficient funds case
  if(user.Balance + balance < 0) {
    return res.status(400).json({
      message: "Inssuficcient funds",
    })
  }

  // Catch for non number balance values
  try {
    user.Balance += balance;
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