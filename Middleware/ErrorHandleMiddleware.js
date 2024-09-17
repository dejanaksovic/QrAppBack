const JsonNotValidMiddleware = async (err, req, res, next) => {
  if(err instanceof SyntaxError) {
    return res.status(400).json({
      message: "Sent formad not valid",
    })
  }
}

module.exports = {
  JsonNotValidMiddleware,
}