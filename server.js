const express = require("express"),
  app = express(),
  AmoCRM = require("amocrm-js"),
  port = process.env.port || 2000,
  config = require("./lib/config.json"),
  morgan = require("morgan");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const crm = new AmoCRM(config.amocrm);

app.use(morgan("dev")).use(express.static(__dirname + "/build"));

require("./lib/router/router")(app, crm);

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, () => {
  console.log("server up & listening at " + port);
});
