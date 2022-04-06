const jwt = require('jsonwebtoken');
const SECRET = "shh"
module.exports = {
  generateToken: (user) => {
    return jwt.sign(user, SECRET, {
      expiresIn: '120s'
    })
  },
  verifyToken: (token) => {
    return jwt.verify(token, SECRET)
  }
}