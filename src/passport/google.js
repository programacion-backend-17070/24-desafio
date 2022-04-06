const GoogleStrategy = require("passport-google-oauth2").Strategy
const userModel = require("../models/user")
const { oauth } = require("../config")

module.exports = (passport) => { 
  const authenticateUser = (accessToken, refreshToken, profile, done) => {
    console.log(profile)

    const user = {
      email: profile.email,
      firstname: profile.given_name,
      lastname: profile.family_name
    }

    // crear o obtener el nuevo usuario
    userModel.findOrCreateByEmail(user.email, user, done)
  }

  passport.use('google', new GoogleStrategy({
    clientID: oauth.GOOGLE_CLIENT_ID,
    clientSecret: oauth.GOOGLE_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  }, authenticateUser))

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.getById(id)
    done(null, {
      id: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    })
  })
}

