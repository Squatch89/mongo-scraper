const express = require('express');
const hbars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 3000;


app.set('views', path.join(__dirname, 'views'));
app.engine("handlebars", hbars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));


app.get("/scrape", function(req,res) {
    request("", function(error, response, html) {
        const $ = cheerio.load(html);
        
        $(".headline--wrapper").each(function(i, element) {
            const headline = $(element).children("a").text();
            const summary = $(element).children("p").text();
            const link = $(element).children("a").attr("href");
            
            if (headline && summary && link) {
                //insert into db
            }
        })
    });
    res.send("scrape complete");
});


app.listen(PORT, function () {
    console.log(`App running on port ${PORT}!`);
});