const path = require("path");
const express = require("express");
const cors = require("cors");
const configViewEngine = (app) => {
  app.set("views", path.join("./src", "views"));
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  // config static file
  app.use(express.static(path.join(__dirname, "../public")));

  // config res.body
  app.use(express.json()); // for json
  app.use(express.urlencoded({ extended: true })); // for form data
  // COR
};

module.exports = configViewEngine;
