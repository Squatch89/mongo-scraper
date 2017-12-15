const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    headline: {
        type: String,
        
    },
    summary: {
        type: String,
        
    },
    link: {
        type: String,
        
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;