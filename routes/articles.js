// eslint-disable-next-line no-undef
const {Router} = require('express');
// eslint-disable-next-line no-undef
const articleController = require('../controllers/articleController');
const router = Router();

router.get('/:pageNo?',articleController.articles_get);
router.get('/show/:id',articleController.articles_get_id);

router.post('/',articleController.articles_post);
router.delete('/delete/:id',articleController.article_delete);

// eslint-disable-next-line no-undef
module.exports = router;