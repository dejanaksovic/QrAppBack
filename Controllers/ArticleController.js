const Article = require("../Models/Article");
const mongoose = require("mongoose");

const createArticle = async (req, res) => {
  const { name, price } = req.body;
  if(!name || !price) {
    return res.status(400).json({
      message: "Ime i cena moraju biti dati"
    })
  }
  if(isNaN(price) || price <= 0) {
    return res.status(400).json({
      message: "Cena mora biti pozitivan broj koji nije nula",
    })
  }

  try {
    const article = await Article.create({
      Name: name,
      Price: price,
    })
    return res.status(201).json({
      article,
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }
}

const getAll = async (req, res) => {
  try {
    const articles = await Article.find();
    return res.status(200).json({
      articles,
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska kontaktirajte administratora",
    })
  }
}

const getById = async (req, res)  => {
  const { id } = req.params;
  if(!id || !mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Artikal nije pronadjen",
    })
  }
  try {
    const article = await Article.findById(id);
    if(!article)
      return res.status(404).json({
        message: "Artikal nije pronadjen",
      })
    return res.status(200).json({
      article,
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }
}

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if(!id) {
    return res.status(404).json({
      message: "Artikal nije pronadjen"
    })
  }

  if(!mongoose.isValidObjectId(id)) {
    return res.status(404).json({
      message: "Artikal nije pronadjen",
    })
  }

  if(!name && !price) {
    return res.status(400).json({
      message: "Atributi za izmenu moraju biti dati",
    })
  }

  try {
    const article = await Article.findByIdAndUpdate(id, {
      Name: name,
      Price: price,
    }, {
      new: false
    })
    if(!article) {
      return res.status(404).json({
        message: "Artikal nije pronadjen",
      })
    }
    return res.status(200).json({
      article,
    })
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska, kontaktirajte administratora",
    })
  }
}

const deleteArticle = async (req, res) => {
  const { id } = req.params;
  if(!id || !mongoose.isValidObjectId(id)) {
    return res.status(500).json({
      message: "Artikal nije pronadjen",
    })
  }
  try {
    const article = await Article.findByIdAndDelete(id);
    if(!article) {
      return res.status(500).json({
        message: "Artikal nije pronadjen",
      })
    }
    return res.status(200).json({
      article,
    }) 
  }
  catch(err) {
    return res.status(500).json({
      message: "Unutrasnja greska kontaktirajte administratora",
    })
  }
}

module.exports = {
  createArticle,
  getAll,
  getById,
  deleteArticle,
  updateArticle,
}