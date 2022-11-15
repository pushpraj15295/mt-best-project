const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./Config/database")
// configuration
dotenv.config({ path: "backend/config/config.env" });


//connection 
connectDatabase();
app.listen(process.env.PORT, () => {
  console.log(`server running on port : http://localhost:${process.env.PORT}`);
});
