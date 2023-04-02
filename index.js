const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const routes = require("./routes");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/agroadvice');
    console.log("database connected");
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(routes);
    app.listen(3000, () => console.log("app running on port 3000"));
}
