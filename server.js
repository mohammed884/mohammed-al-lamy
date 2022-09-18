require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index.js");
const adminRouter = require("./routes/admin.js");
const flash = require("express-flash")
const session = require("express-session")
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.use(flash());

//ROUTES
app.use("/", indexRouter)
app.use("/admin", adminRouter);
app.listen(process.env.PORT || 80, err => {
    if (err) throw err;
    console.log(`Connected to port ${process.env.PORT}`);
})