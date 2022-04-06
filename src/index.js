(async () => {
  const express = require('express');
  const path = require('path');
  const mongoose = require("mongoose")
  const app = express();

  const { engine } = require('express-handlebars');

  // middlewares

  const cookieParser = require("cookie-parser")
  const session = require("express-session")

  // session store

  const MongoStore = require("connect-mongo")
  const { mongoConfig } = require("./config")

  // routers

  const homeRouter = require("./routes/home")
  const productsApiRoutes = require("./routes/api/products")

  // passport
  const passport = require('passport')
  const flash = require('express-flash')
  const initializePassportLocal = require("./passport/local")
  const initializePassportGoogle = require("./passport/google")

  const PORT = process.env.PORT || 8080
  const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = mongoConfig

  await mongoose.connect(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS} `)

  initializePassportLocal(passport)
  initializePassportGoogle(passport)

  app.set('view engine', 'hbs');
  app.engine('hbs', engine({
    layoutsDir: path.join(__dirname, '../views/layouts'),
    extname: 'hbs',
    defaultLayout: 'index'
  }));

  console.log(`${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`)
  // json middlewares -> req.body {}
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(flash())
  app.use(cookieParser("esto es un secreto")) // req.cookies = {}
  app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,

    store: new MongoStore({
      mongoUrl: `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`,
      ttl: 1 * 60,
      expires: 1000 * 1 * 60,
      autoRemove: "native"
    })
  })) // req.session
  app.use(passport.initialize())
  app.use(passport.session())

  app.use("/static/", express.static(path.join(__dirname, "../public")))

  app.use("/", homeRouter)
  app.use("/api", productsApiRoutes)

  app.listen(
    PORT,
    () => console.log(`listening on http://localhost:${PORT}`)
  )
})()