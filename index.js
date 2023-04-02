const fs = require('fs');
const http = require("http");
const https = require('https');
const express = require("express");
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const routes = require("./routes");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/agroadvice');
    console.log("database connected");
    const app = express();
    app.use((req, res, next) => {
        if (req.protocol === 'http') {
            return res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
    });
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(routes);
    app.use(express.static(__dirname + '/dist/agri'));
    app.all('*', (req, res) => {
        res.status(200).sendFile(__dirname + '/dist/agri/index.html');
    });

    https
    .createServer(
      {
        key: fs.readFileSync(
          "/etc/letsencrypt/live/agroadvice.violetdesk.com/privkey.pem",
          "utf8"
        ),
        cert: fs.readFileSync(
          "/etc/letsencrypt/live/agroadvice.violetdesk.com/cert.pem",
          "utf8"
        ),
        ca: fs.readFileSync(
          "/etc/letsencrypt/live/agroadvice.violetdesk.com/chain.pem",
          "utf8"
        ),
      },
      app
    )
    .listen(443, () => console.log("HTTPS Server Started"));
  // http server
  http.createServer(app).listen(80, () => console.log("HTTP Server Started"));
}
