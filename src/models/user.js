const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

// Single responsability principle
// S.O.L.I.D

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

  // guardar usuario
  async save(obj) {
    obj.password = await bcrypt.hash(obj.password, 10)
    return await this.model.create(obj)
  }

  // existe por email

  existsByEmail(email) {
    return this.model.exists({ email })
  }

  async getById(id) {
    return await this.model.findById(id)
  }


  // obtener un usuario por email
  async getByEmail(email) {
    const user = await this.model.findOne({ email })

    return {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email
    }
  }

  // checa que las passwords coincidan
  // regresa true o false
  async isPasswordValid(email, pwd) {
    const user = await this.model.findOne({ email })

    return await bcrypt.compare(pwd, user.password)
  }

}

module.exports = new UserModel()