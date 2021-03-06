const Router = require("express").Router
const faker = require("faker")
const userModel = require("../../models/user")
const { generateToken } = require("../../auth/jwt")

const auth = require("../../middlewares/jwt")

const router = Router()

// ruta de productos
router.get("/", auth, (req, res) => res.send([1, 2, 3, 4, 5, 6].map(id => ({
  id,
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  description: faker.commerce.productDescription()
}))))


router.post("/login", async (req, res) => {
  const { email, pwd } = req.body

  try {
    if (!await userModel.existsByEmail(email)) {
      return res.status(400).send({
        error: 'user does not exist!'
      })
    }

    if (!await userModel.isPasswordValid(email, pwd)) {
      return res.status(400).send({
        error: 'incorrect password!'
      })
    }

    const user = await userModel.getByEmail(email)

    const token = generateToken(user)
    res.send(token)
  } catch (err) {
    return res.send("an error ocurred: " + err.message)
  }
})

module.exports = router

