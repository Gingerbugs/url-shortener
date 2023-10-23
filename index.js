require('dotenv').config();
const express = require('express');
const cors = require('cors');
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

const Url = require("./models/url.js");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

//Mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vlfagzz.mongodb.net/?retryWrites=true&w=majority`
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


//Database insert function
async function insertUrl(req, res) {
  const url = new Url({url: req.body.url});
  await url.save();
  await Url.updateOne({url: url.url}, {short_url: url._id.toString().slice(-6)});

  res.json({"original_url": req.body.url, "short_url": url._id.toString().slice(-6)});
};

//Database query function
async function getUrl(req, res) {
  const url = await Url.find({short_url: req.params.id}).exec();
  if (url.length === 0) {
    res.send("Not Found");
  }  else {
    res.redirect(url[0].url);
  }
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:id", asyncHandler((req,res) => getUrl(req,res)));

app.post("/api/shorturl",

  body("url").trim().notEmpty().isURL(),

  asyncHandler((req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({"error": "Invalid URL"});
      return;
    } else {
      insertUrl(req, res);
    }
  })
);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
