// eslint-disable-next-line no-undef
const {Router} = require('express');
// eslint-disable-next-line no-undef
const authController = require('../controllers/authControlles');
const router = Router();

router.get('/register',authController.register_get);
router.post('/register',authController.register_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout',authController.logout_get);

// eslint-disable-next-line no-undef
module.exports = router;