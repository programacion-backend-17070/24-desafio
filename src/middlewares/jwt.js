const { verifyToken } = require("../auth/jwt")

module.exports = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).send({
      error: 'unauthorized'
    })
  }

  // Authorization: Bearer <token>

  const token = header.split(" ")[1]

  console.log(token)

  if (!verifyToken(token)) {
    return res.status(401).send({
      error: "unauthorized"
    })
  }

  next()
}