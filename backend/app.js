const express = require("express");
const app = express();

// get token from cookie
const cookieParser = require("cookie-parser")

const errorMiddleware = require("./middleware/error")

// app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(cookieParser());

app.get('/' ,(req, res) => res.send('wellcome to home'))

// all Route import here*******************************************************************//
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);



// middleware for error 
app.use(errorMiddleware)

module.exports = app;
