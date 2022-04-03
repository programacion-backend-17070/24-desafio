const LocalStrategy = require("passport-local").Strategy
const userModel = require("../models/user")

module.exports = (passport) => {
  const authenticateUser = async (email, password, done) => {
    console.log(email, password)
    try {
      if (!await userModel.existsByEmail(email)) {
        console.log("no email")
        return done(null, false , { message: 'user does not exist!' })
      }

      if (!await userModel.isPasswordValid(email, password)) {
        console.log("incorrect pwd")
        return done(null, false , { message: 'incorrect password!' })
      }

      console.log("user")
      const user = await userModel.getByEmail(email)


      done(null, user)
    } catch (err) {
      done(err)
    }
  }

  const registerUser = async (req, email, password, done) => {
    const { fname, lname } = req.body
    try {
      if (await userModel.existsByEmail(email)) {
        return done(null, false, { message: 'user already exists!' })
      }
  
      const user = await userModel.save({
        email,
        firstname: fname,
        lastname: lname,
        password: password
      })
  
      console.log(user)
  
      done(null, user)
    } catch (err) {
      done(err)
    }
  }

  // passport.use(new LocalStrategy(options, verifyFunction)
  // registrar estrategias
  passport.use('local', new LocalStrategy({ usernameField: 'email', passwordField: 'pwd'}, authenticateUser))
  passport.use('register', new LocalStrategy({ usernameField: 'email', passwordField: 'pwd', passReqToCallback: true }, registerUser))

  // serializar usuario
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    console.log("id")
    return done(null, await userModel.getById(id))
  })


  //Serializar y deserializar

  // passport no guarda el usuario, guarda un identificador a el
  // por eso lo deserializamos
  // 1 => serializacion
  // 1 => obj deserializacion

  // passport.serializeUser((user, done) => {
  //   done(null, user.id)
  // })

  // passport.deserializeUser((id, done) => {
  //   // buscar el usuario en la DB
  //   done(null, {})
  // })
}