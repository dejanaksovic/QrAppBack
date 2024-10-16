const mongoose = require('mongoose');
const User = require("../Models/User");
const ErrorType = require("../Responses/ErrorType");
const { validatePagination } = require("../Utils/Transformations")
const { createQR } = require("../Utils/QrWork");
const { errorCodes } = require("../Utils/Enums");
const { writeLog } = require('../Utils/Logger');

class UserRepository {
  static validateInput(name, initCoins) {
    if(!name) {
      return new ErrorType(errorCodes.UserError, "Neophodan parametar", { name: name });
    }
    if(initCoins && isNaN(initCoins)) {
      return new ErrorType(errorCodes.UserError, "Nevalidan parametar", {coins: initCoins});
    }
    return true;
  }

  static async validateId(id) {
    if(!id || !mongoose.isValidObjectId(id)) {
      return new ErrorType(404, "Nije pronadjen korisnik", {id: id});
    }

    return true;
  }

  static async getPaginated(ps, pc, nameFilter) {
    // Init values
    ps = ps ?? 0;
    pc = pc ?? 5;
    nameFilter = nameFilter ?? "";
    const status = validatePagination(ps, pc);
    if(status instanceof ErrorType) {
      return status;
    }
    try {
      const users = await User.find({Name: {
        $regex: ".*" + nameFilter + ".*",
        $options: "i",
      }}).skip(ps * pc).limit(pc);
      return users;
    }
    catch(err) {
      return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", { DbErr: "Connection error" });
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
        return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", { DbErr: "No connection" });
      }

      const qrCode = await createQR(user._id);

      if(qrCode instanceof ErrorType) {
        return qrCode;
      }

      user.Qr = qrCode;
      await user.save();

      return user;
    }
    catch(err) {
      writeLog("ERROR", err);
      return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", { DbErr: "No connection" });
    }

  }

  static async getUserById(id) {
    const validId = this.validateId(id);
    if(validId instanceof ErrorType) {
      return validId;
    }
    try {
      const user = await User.findById(id);
      if(!user) {
        return new ErrorType(errorCodes.NotFound, "Nije pronadjen korisnik", {id});
      }
      return user;
    }
    catch(err) {
      writeLog("ERROR", err.message);
      return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", { DbErr: "Connection error" });
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
        return new ErrorType(errorCodes.NotFound, "Korisnik nije pronadjen", { id });
      }
      return user;
    }
    catch(err) {
      return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", { DbErr: "Connection error" });
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
        return new ErrorType(errorCodes.NotFound, "Korisnik nije pronadjen", { id });
      }
      return user;
    }
    catch(err) {
      return new ErrorType(errorCodes.InteralError, "Unutrasnja greska", { DbErr: "Connection error" });
    }
  }
}

module.exports = UserRepository;