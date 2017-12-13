const mongoose = require('mongoose');

const Schema = mongoose.Schems;

const ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: String,
    link: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;