const Router = require("express").Router
const auth = require("../middlewares/auth")

const router = Router()

router.get("/", auth, (req, res) => {

  const { name } = req.session.user

  res.render("main", { name })
})

router.get("/login", (req, res) => res.render("login", { layout: 'login' }))

router.post("/login", (req, res) => {
  const { username } = req.body

  req.session.user = {
    name: username
  }

  res.redirect("/")
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