const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./Config/database");
// configuration
dotenv.config({ path: "backend/config/config.env" });

//connection
connectDatabase();
const server = app.listen(process.env.PORT, () => {
  console.log(`server running on port : http://localhost:${process.env.PORT}`);
});

// unhandled Promise rejection in server
process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log("shutting down server due to Unhandle Promise Rejection");

  server.close(() => {
    process.exit();
  });
});
