const Router = require("express").Router
const auth = require("../middlewares/auth")
const userModel = require("../models/user")

const router = Router()

router.get("/", auth, (req, res) => {

  const { firstname, lastname } = req.session.user

  res.render("main", { name: `${firstname} ${lastname}` })
})

router.get("/login", (req, res) => res.render("login", { layout: 'login' }))
router.get("/register", (req, res) => res.render("register", { layout: 'login' }))

router.post("/register", async (req, res) => {
  const { email, pwd, fname, lname } = req.body

  // checar que no exista el email
  // guardar usuario en db
  // crear session
  // redirigir a pagina principal (landing page) 

  try {
    if (await userModel.existsByEmail(email)) {
      res.render("register", {
        layout: 'login',
        error: 'user already exists!'
      })
    }

    const user = await userModel.save({
      email,
      firstname: fname,
      lastname: lname,
      password: pwd
    })

    console.log(user)
    req.session.user = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    }

    res.redirect("/")

  } catch (err) {
    return res.send("an error ocurred: " + err.message)
  }
})

router.post("/login", async (req, res) => {
  const { email, pwd } = req.body

  // checar que exista el email
  // checar que passwords coincidan
  // crear session
  // redirigir a pagina principal (landing page)
  try {
    if (!await userModel.existsByEmail(email)) {
      return res.render("login", {
        layout: 'login',
        error: 'user does not exist!'
      })
    }

    if (!await userModel.isPasswordValid(email, pwd)) {
      return res.render("login", {
        layout: 'login',
        error: 'incorrect password!'
      })
    }

    const user = await userModel.getByEmail(email)


    req.session.user = user

    res.redirect("/")
  } catch (err) {
    return res.send("an error ocurred: " + err.message)
  }
})

router.get("/logout", auth, (req, res) => {
  const { firstname, lastname } = req.session.user

  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      res.send("hubo un error")
      return
    }

    res.render("logout", { layout: 'logout', name: `${firstname} ${lastname}` }) // despues de aqui el backend no puede hacer mas nada
  })
})

module.exports = router