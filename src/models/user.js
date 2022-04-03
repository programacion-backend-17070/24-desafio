const { Schema, model } = require("mongoose")

class UserModel {
  constructor() {
    const schema = new Schema({
      email: String,
      firstname: String,
      lastname: String,
      password: String
    })

    this.model = model("users", schema)
  }

  async save(obj) {
    return await this.model.create(obj)
  }

  existsByEmail(email) {
    return this.model.exists({ email })
  }

  async getByEmail(email) {
    const user = await this.model.findOne({ email })

    return {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    }
  }

  async isPasswordValid(email, pwd) {
    const user = await this.model.findOne({ email })

    return pwd === user.password
  }
}

module.exports = new UserModel()