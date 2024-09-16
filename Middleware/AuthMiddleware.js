const adminAuth = async(req, res, next) => {
  const password = req.headers?.authorization;

  if(!password) {
    return res.status(401).json({
      message: "Unauthorized access",
    })
  }
  console.log(password);
  console.log(process.env.ADMIN_PASSWORD);
  if(password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({
      message: "Forbbiden action",
    })
  }
  next();
}

const workerAuth = async(req, res, next) => {
  const password = req.headers?.authorization;

  if(!password) {
    return res.status(401).json({
      message: "Unauthorized access",
    })
  }

  if(password !== process.env.WORKER_PASSWORD) {
    return res.status(403).json({
      message: "Forbbiden action",
    })
  }
  next();
}

module.exports = {
  adminAuth,
  workerAuth,
}