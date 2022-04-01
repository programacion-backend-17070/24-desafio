(async () => {
  const express = require('express');
  const path = require('path');
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

  const PORT = process.env.PORT || 8080
  const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } = mongoConfig

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

  app.use("/static/", express.static(path.join(__dirname, "../public")))

  app.use("/", homeRouter)

  app.listen(
    PORT,
    () => console.log(`listening on http://localhost:${PORT}`)
  )
})()