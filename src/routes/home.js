const Router = require("express").Router
const auth = require("../middlewares/auth")
// const userModel = require("../models/user")

const router = Router()

router.get("/", auth, (req, res) => {

  const { name } = req.session.user

  res.render("main", { name })
})

router.get("/login", (req, res) => res.render("login", { layout: 'login' }))
router.get("/register", (req, res) => res.render("register", { layout: 'login' }))

router.post("/login", (req, res) => {
  res.send(req.body)
})

router.post("/register", (req, res) => {
  res.send(req.body)
})


router.post("/register", (req, res) => {
  res.send(req.body)
})

router.get("/logout", auth, (req, res) => { 
  const { name } = req.session.user

  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      res.send("hubo un error")
      return
    }

    res.render("logout", { layout: 'logout', name }) // despues de aqui el backend no puede hacer mas nada
  })
})

module.exports = router