/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugify = require('slugify');
const domPurifier = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);

const { stripHtml } = require('string-strip-html');

const articleSchema = new Schema({
    title: {
        type : String ,
        required : [true,'title is required']
    },
    description: {
        type:String,
        required : [true,'description is required']
    },
    urlImg : {
        type : String,
        required : [true , 'Image is required ']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});
 
// Fire a function after doc saved to db
articleSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc);
    next();
});


articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if (this.description) {
        this.description = htmlPurify.sanitize(this.description);
        this.sanitizedHtml = stripHtml(this.description.substring(0,100)).result;
        console.log(this.sanitizedHtml);
    }


    next();
});

// Create a model based on that schema
const Article = mongoose.model('Article', articleSchema);

// export the model
module.exports = Article;