const confirmWorkerLogin = async (req, res) => {
  const { password } = req.body;
  if(!password) {
    return res.status(401).json({
      message: "Kredencijali moraju biti dati",
    })
  }
  if(password !== process.env.WORKER_PASSWORD) {
    return res.status(400).json({
      message: "Kredencijali nisu validni"
    })
  }
  return res.status(200).send();
}

const confirmAdminLogin = async (req, res) => {
  const { password } = req.body;

  if(!password) {
    return res.status(401).json({
      message: "Kredencijali moraju biti dati",
    })
  }

  if(password !== process.env.ADMIN_PASSWORD) {
    return res.status(400).json({
      message: "Nevalidni kredencijali"
    })
  }
  return res.status(200).send();
}

module.exports = {
  confirmWorkerLogin,
  confirmAdminLogin,
}