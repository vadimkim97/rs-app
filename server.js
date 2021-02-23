const express = require("express"),
  app = express(),
  port = process.env.port || 2000,
  morgan = require("morgan"),
  handlers = require("./lib/handler/handler");

app
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static(__dirname + "/build"));

require("./lib/router/router")(app, handlers);

app
  .get("/*", (req, res) => {
    res.sendFile(__dirname + "/build/index.html");
  })

  .listen(port, () => {
    console.log("server up & listening at " + port);
  });
