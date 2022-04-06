const { verifyToken } = require("../auth/jwt")


module.exports = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).send({
      error: 'unauthorized'
    })
  }

  // checar cualquier token
  // luego poner bearer
  // console.log(header)

  const token = header.split(' ')[1]

  console.log(token)

  try {
    const data = verifyToken(token)
    console.log(data)
    next()
  } catch (e) {
    res.status(401).send({
      error: "unauthorized"
    })
  }
}