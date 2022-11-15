const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error")

// app.use(express.urlencoded({ extended : true }))
app.use(express.json())

// app.get('/' ,(req, res) => res.send('wellcome to home'))

// all Route import here*******************************************************************//
const product = require("./routes/productRoute");
app.use("/api/v1", product);

// middleware for error 
app.use(errorMiddleware)

module.exports = app;
