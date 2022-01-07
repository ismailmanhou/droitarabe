/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const Article = require('../models/articleSchema');

//handleErrors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { title: '', body: '', urlImg: '' };

    //validation
    if (err.message.includes('Article validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            //console.log(properties);
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

module.exports.articles_get = async (req, res) => {
    let pageNo = 1;

    if (req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo);
    }
    if (req.params.pageNo == 0) {
        pageNo = 1;
    }
    let q = {
        skip: 8 * (pageNo - 1),
        limit: 8,
    };
    //find total
    let totalDocs = 0;
    Article.countDocuments({}, (err, total) => {}).then((response) => {
    // console.log(response);
        totalDocs = parseInt(response);
        Article.find({}, {}, q)
            .then((result) => {
                res.render('index', {
                    pageTitle: ' القانون بالعربية',
                    arrArticle: result,
                    total: parseInt(totalDocs),
                    pageNo: pageNo,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

module.exports.articles_get_id = async (req, res) => {
    Article.findOne({ slug: req.params.id })
        .then((result) => {
            res.render('showSingleArticle', {
                pageTitle: 'القانون بالعربية',
                objArticle: result,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};
module.exports.articles_post = (req, res) => {
    const article = new Article(req.body);
    article
        .save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        });
};

// eslint-disable-next-line no-undef
module.exports.article_delete = (req, res) => {
    Article.findByIdAndDelete(req.params.id)

        .then((result) => {
            res.json({ mylink: '/all-articles' });
        })

        .catch((err) => {
            console.log(err);
        });
};
