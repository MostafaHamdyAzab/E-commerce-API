const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "config.env" });

module.exports = mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI).then((conn) => {
  console.log("Db Connected Successfully To ", conn.connection.host);
});
// .catch((err)=>{
//     process.env.MSG="Db Connection Error";
//     console.log(err);
// })
