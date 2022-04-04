const Router = require("express").Router
const auth = require("../middlewares/auth")
const user = require("../models/user")
const userModel = require("../models/user")

const router = Router()

router.get("/", auth, (req, res) => {

  const { name } = req.session.user

  res.render("main", { name })
})

router.get("/login", (req, res) => res.render("login", { layout: 'login' }))
router.get("/register", (req, res) => res.render("register", { layout: 'login' }))

router.post("/login", async (req, res) => {
  const { email, pwd } = req.body
  try {
    // checar que exista el email
    if (!await userModel.existsByEmail(email)) {
      // regresar al usuario a la misma pantalla
      console.log("no existe")
      return res.render("login", {
        layout: "login",
        error: 'user does not exist!'
      })
    }

    // checar que passwords coincidan
    if (!await userModel.isPasswordValid(email, pwd)) {
      return res.render("login", {
        layout: "login",
        error: 'incorrect password!'
      })
    }

    // obtener el usuario
    const user = await userModel.getByEmail(email)

    // crear session

    req.session.user = user

    // redirigir a pagina principal (landing page)
    res.redirect("/")
  } catch (e) {
    return res.status(500).send("an error ocurred: " + err.message)
  }
})

router.post("/register", async (req, res) => {
  const { email, pwd, fname, lname } = req.body

  try {
    // checar que no exista el email
    if (await userModel.existsByEmail(email)) {
      // regresar al usuario a la misma pantalla
      console.log("ya existe")
      return res.render("register", {
        layout: "login",
        error: 'user already exists!'
      })
    }
    // guardar usuario en db
    const user = await userModel.save({
      email,
      firstname: fname,
      lastname: lname,
      password: pwd
    })
    
    // crear session

    req.session.user = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      name: `${user.firstname} ${user.lastname}`
    }

    // redirigir a pagina principal (landing page)

    res.redirect("/")
  } catch(err) {
    return res.status(500).send("an error ocurred: " + err.message)
  }
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