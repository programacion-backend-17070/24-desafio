const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { oauth } = require("../config")
const userModel = require("../models/user")

console.log(oauth)

module.exports = (passport) => {

  const authUser = async (accessToken, refreshToken, profile, done) => {
    const user = {
      email: profile.email,
      firstname: profile.given_name,
      lastname: profile.family_name,
    }

    userModel.model.findOneAndUpdate(
      { email: user.email },
      user,
      { upsert: true, new: true },
      (err, u) => {
        console.log(err)
        return done(err, {
          id: u._id.toString(),
          firstname: u.firstname,
          lastname: u.lastname
        });
      })
    
    // });
  }

  passport.use('google', new GoogleStrategy({
    clientID: oauth.GOOGLE_CLIENT_ID,
    clientSecret: oauth.GOOGLE_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
  }, authUser));

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.getById(id)
    done(null, {
      id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname
    })
  })
}