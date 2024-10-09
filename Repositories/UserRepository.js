const mongoose = require('mongoose');
const User = require("../Models/User");
const ErrorType = require("../Responses/ErrorType");
const { validatePagination } = require("../Utils/Transformations")

class UserRepository {
  static validateInput(name, initCoins) {
    if(!name) {
      return new ErrorType(400, "Neophodan parametar", { name: name });
    }
    if(initCoins && isNaN(initCoins)) {
      return new ErrorType(400, "Nevalidan parametar", {coins: initCoins});
    }
    return true;
  }

  static async validateId(id) {
    if(!id || !mongoose.isValidObjectId(id)) {
      return new ErrorType(404, "Nije pronadjen korisnik", {id: id});
    }

    return true;
  }

  static async getPaginated(pageStart, pageSlice) {
    // Init values
    pageStart = pageStart ?? 0;
    pageSlice = pageSlice ?? 5;
    const status = validatePagination(pageStart, pageSlice);
    if(status instanceof ErrorType) {
      return status;
    }
    try {
      const users = await User.find().skip(pageStart * pageSlice).limit(pageSlice);
      return users;
    }
    catch(err) {
      return new ErrorType(500, "Unutrasnja greska", { DbErr: "Connection error" });
    }
  }

  static async addUser(name, initCoins) {
    const status = this.validateInput(name, initCoins);
    if(status instanceof ErrorType) {
      return status;
    }

    try {
      const user = await User.create({
        Name: name,
        Coins: initCoins,
      })

      if(!user) {
        return new ErrorType(500, "Unutrasnja greska", { DbErr: "No connection" });
      }

      return user;
    }
    catch(err) {
      return new ErrorType(500, "Unutrasnja greska", { DbErr: "No connection" });
    }

  }

  static async getUserById(id) {
    const status = this.validateId(id);
    if(status instanceof ErrorType) {
      return status;
    }
    try {
      const user = await User.findById(id);
      if(!user) {
        return new ErrorType(404, "Nije pronadjen korisnik", {id});
      }
      return user;
    }
    catch(err) {
      return new ErrorType(500, "Unutrasnja greska", { DbErr: "Connection error" });
    }
  }

  static async deleteUserById(id) {
    const status = this.validateId(id);
    if(status instanceof ErrorType) {
      return status;
    }
    try {
      const user = await User.findByIdAndDelete(id);
      if(!user) {
        return new ErrorType(404, "Korisnik nije pronadjen", { id });
      }
      return user;
    }
    catch(err) {
      return new ErrorType(500, "Unutrasnja greska", { DbErr: "Connection error" });
    }
  }

  static async updateUserById(id, params) {
    const { name, coins } = params || {};
    const nameStatus = this.validateId(id);
    if(nameStatus instanceof ErrorType) {
      return nameStatus;
    } 
    // cheating
    const paramsStatus = this.validateInput(name ?? "some", coins);
    if(paramsStatus instanceof ErrorType) {
      return paramsStatus;
    }
    try {
      const user = await User.findByIdAndUpdate(id, { Name: name, Coins: coins }, {new: true});
      if(!user) {
        return new ErrorType(404, "Korisnik nije pronadjen", { id });
      }
      return user;
    }
    catch(err) {
      return new ErrorType(500, "Unutrasnja greska", { DbErr: "Connection error" });
    }
  }
}

module.exports = UserRepository;