import express from "express";
import Activity from "./model/activity.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
//Konfigūracija POST/PUT metodu perduodamų duomenų priėmimui
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //get post date in nodejs
app.use(express.static(path.join(__dirname, "../build")));

await mongoose.connect("mongodb://localhost:27017/test");
const file = "./src/model/webActivity.json";
app.post("/", async (req, res) => {
  try {
    let userActivity = new Activity(req.body);
    let user = await userActivity.save();
    res.send(JSON.stringify(user));

    /* ====================== Saves user action in local storage ====================== */
    let data = await fs.readFile(file, "utf8");
    data = JSON.parse(data);
    data.push(req.body);
    data = JSON.stringify(data, null, 4);
    await fs.writeFile(file, data);
  } catch (error) {
    console.log(error);
    await fs.writeFile(file, JSON.stringify([req.body], null, 4));
  }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(process.env.PORT || 8080, () =>
  console.log(`listening on port ${process.env.PORT || 8080}`)
);
