const express = require('express');
const path = require('path');
const hbars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');
const logger = require("morgan");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", hbars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
    useMongoClient: true
});

let scraped = {};

app.get("/scrape", function (req, res) {
    
    request("https://www.theonion.com/", function (error, response, html) {
        const $ = cheerio.load(html);
        
        $(".headline--wrapper").each(function (i, element) {
            
            scraped.headline = $(this).children("a").text();
            scraped.summary = $(this).children("p").text();
            scraped.link = $(this).children("a").attr("href");
            
            console.log("---------------");
            console.log(scraped);
            console.log("---------------");
            
            if (scraped.headline && scraped.link)
            {
                db.Article
                    .create(scraped)
                    .then(function (dbArticle) {
                        // console.log(dbArticle);
                        res.send("scrape complete");
                    })
                    .catch(function (err) {
                        res.json(err);
                    })
            }
        });
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (articles) {
            // res.json(articles);
            console.log(articles);
            res.render("index", {scraped: articles});
        }).catch(function (err) {
        if (err) {
            console.log(err);
        }
    })
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({_id: req.params.id})
        .populate("comment")
        .then(function (articleComment) {
            console.log(articleComment);
            res.json(articleComment)
        }).catch(function (err) {
        if (err) {
            console.log(err);
        }
    });
});

app.post("/articles/:id", function(req, res) {
    console.log(req.body);
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
        })
        .then(function(dbArticle) {
            // res.send("made a comment");
            res.json(dbArticle);
        })
        .catch(function(err) {
            if (err) {
                console.log(err);
            }
        })
});

app.listen(PORT, function () {
    console.log(`App running on port ${PORT}!`);
});