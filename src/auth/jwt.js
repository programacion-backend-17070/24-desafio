const jwt = require("jsonwebtoken")
const SECRET = "shh"

module.exports = {
  generateToken: (user) => {
    return jwt.sign(user, SECRET, {
      expiresIn: '180s'
    })
  },
  verifyToken: (token) => {
    try {
      jwt.verify(token, SECRET)
      return true
    } catch (e) {
      return false
    }
  }
}