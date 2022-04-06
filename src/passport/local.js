const LocalStategy = require("passport-local").Strategy
const userModel = require("../models/user")

module.exports = (passport) => {
  const authenticateUser = async (email, password, done) => {
    try {
      // checar que exista el email
      console.log(email)
      if (!await userModel.existsByEmail(email)) {
        // regresar al usuario a la misma pantalla
        console.log("no existe desde passport")
        return done(null, false, { message: 'user does not exist!' })
      }

      // checar que passwords coincidan
      // { messages.error: []} // array de errores
      if (!await userModel.isPasswordValid(email, password)) {
        return done(null, false, { message: 'incorrect password!' }) 
      }

      // obtener el usuario
      const user = await userModel.getByEmail(email)

      done(null, user)
    } catch (e) {
      done(e)
    }
  }

  const registerUser = async (req, email, password, done) => {
    const { fname, lname } = req.body

    try {
      // checar que no exista el email
      if (await userModel.existsByEmail(email)) {
        // regresar al usuario a la misma pantalla
        console.log("ya existe")
        return done(null, false, { message: 'user already exists!' })
      }
      // guardar usuario en db
      const user = await userModel.save({
        email,
        password,
        firstname: fname,
        lastname: lname,
      })

      console.log(user)

      done(null, {
        id: user._id.toString(),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      })
    } catch (err) {
      done(err)
    }
  }
  // username y password
  passport.use('login', new LocalStategy({ usernameField: 'email', passwordField: 'pwd' }, authenticateUser))
  passport.use('register', new LocalStategy({ usernameField: 'email', passwordField: 'pwd', passReqToCallback: true }, registerUser))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    console.log(id)
    const user = await userModel.getById(id)
    done(null, {
      id: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    })
  })
}