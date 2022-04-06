const Router = require("express").Router
const auth = require("../middlewares/auth")
const { generateToken } = require("../auth/jwt")
const passport = require("passport")

const router = Router()

router.get("/", auth, (req, res) => {
  console.log(req.user)

  const { firstname, lastname } = req.user

  res.render("main", { name: `${firstname} ${lastname}` })
})

router.get("/login", (req, res) => res.render("login", { layout: 'login' }))
router.get("/register", (req, res) => res.render("register", { layout: 'login' }))

router.get("/login/token", (req, res) => {
  console.log(req.user)
  const token = generateToken(req.user)
  console.log(token)
  res.cookie("token", token)

  res.redirect("/")
})

router.post("/login", passport.authenticate("login", {
  successRedirect: "/login/token",
  failureRedirect: "/login",
  failureFlash: true
}))

router.post("/register", passport.authenticate("register", {
  successRedirect: "/",
  failureRedirect: "/register",
  failureFlash: true
}))

// ====== GOOGLE =====

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// ====== END GOOGLE =====

router.get("/logout", auth, (req, res) => {
  const { firstname, lastname } = req.user

  req.logOut()
  res.render("logout", { layout: 'logout', name: `${firstname} ${lastname}` })
})

module.exports = router