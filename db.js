require("dotenv").config();
const log = require("./utils/logger.js");

console.log("DB");
const mongoose = require("mongoose");
const db_name = process.env.DB_NAME || "IoT";
const db_host = process.env.DB_HOST || "localhost"; //192.168.0.243
console.log({ db_name });
// mongoose.set('debug', true);

mongoose
  .connect(`mongodb://${db_host}/${db_name}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    log(`Connected to MongoDB @ ${db_host} ${db_name}`);
  })
  .catch((error) => {
    log(error.message);
  });

module.exports = mongoose;
