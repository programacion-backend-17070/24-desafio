const Router = require("express").Router
const auth = require("../middlewares/auth")
const user = require("../models/user")
const userModel = require("../models/user")
const passport = require("passport")
const { authenticate } = require("passport/lib")

const router = Router()

router.get("/", auth, (req, res) => {

  const { firstname, lastname } = req.user

  res.render("main", { name: `${firstname} ${lastname}` })
})

// USUARIO Y CONTRASEÑA
router.get("/login", (req, res) => res.render("login", { layout: 'login' }))
router.get("/register", (req, res) => res.render("register", { layout: 'login' }))
router.post("/login", passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))
router.post("/register", passport.authenticate("register", {
  successRedirect: "/",
  failureRedirect: "/register",
  failureFlash: true
}))

// INICIO DE SESION CON GOOGLE

router.get("/auth/google", passport.authenticate("google", {
  scope: ['email', 'profile']
}))

router.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login"
}))

router.get("/logout", auth, (req, res) => {
  const { firstname, lastname } = req.user

  req.logOut()
  res.render("logout", { layout: 'logout', name: `${firstname} ${lastname}` })
})

module.exports = router