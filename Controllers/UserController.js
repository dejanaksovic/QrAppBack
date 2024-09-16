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
      const selfUrl = process.env.SELF_URL;
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
  if(!id || !mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Korisnik nije pronadjen"
    })
  }
  if(!name) {
    return res.status(404).json({
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

  if(!articlesOrdered || !id) {
    return res.status(400).json({
      message: "Artikli i id moraju biti dati",
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

  // CalculatePoints
  let pointsCount = 0;

  articlesStatic.forEach(e => {
    const orderedArticle = articlesOrdered?.find(ao => ao.name === e.name);
    const quantity = Number(orderedArticle?.quantity);
    if(!isNaN(quantity)) {
      console.log(pointsCount);
      pointsCount += e.price * Number(quantity);
    }
    })

  if(isNaN(pointsCount)) {
    return res.status(400).json({
      message: "Kvantitivnost proizvoda mora biti broj",
    })
  }

  user.Coins += pointsCount;
  user.save();
  return res.status(200).json({
    user
  });
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

module.exports = {
  createUser,
  changeUserName,
  getAllUserInfo,
  getUserById,
  addOrder,
  deleteUserById,
}