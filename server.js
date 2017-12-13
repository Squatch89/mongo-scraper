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

app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", hbars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// app.get("/", function(req, res) {
//     res.render("index");
// });

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
    useMongoClient: true
});

app.get("/scrape", function (req, res) {
    
    let scraped = {};
    
    request("https://www.theonion.com/", function (error, response, html) {
        const $ = cheerio.load(html);
        
        $(".headline--wrapper").each(function (i, element) {
            const headline = $(element).children("a").text();
            const summary = $(element).children("p").text();
            const link = $(element).children("a").attr("href");
            
            scraped = {
                headline,
                summary,
                link
            };
            
            console.log("---------------");
            console.log(scraped);
            console.log("---------------");
            
            db.Article
                .create(scraped)
                .then(function (dbArticle) {
                    res.render("index", scraped);
                })
                .catch(function (err) {
                    res.json(err);
                })
        });
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (articles) {
            res.json(articles);
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
            res.json(articleComment)
        }).catch(function (err) {
        if (err) {
            console.log(err);
        }
    });
});

app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
        })
        .then(function(dbArticle) {
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