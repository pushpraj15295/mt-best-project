const mongoose = require("mongoose");

const connectDatabase = ()=>{

    mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then((data) => {
    console.log(`mongodb connected with server ${data.connection.host}`);
  })
  .catch((error) => {
    console.log("error", error);
  });
}

module.exports = connectDatabase;
