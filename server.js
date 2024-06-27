const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const uriDB = process.env.DB_URL;
const PORT = process.env.MAIN_PORT;

const connection = mongoose.connect(uriDB);

const serverStart = async () => {
  try {
    await connection;
    app.listen(PORT, () => {
      console.log("Database connection successful.");
    });
  } catch (error) {
    console.log("Database connection fail");
    process.exit(1);
  }
};

serverStart();
