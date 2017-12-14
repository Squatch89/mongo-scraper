const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    headline: {
        type: String,
        unique: true,
        required: true
    },
    summary: {
        type: String,
        unique: true,
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;