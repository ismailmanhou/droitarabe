/* eslint-disable no-undef */
//  To controll ur website
// eslint-disable-next-line no-undef
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/articles');
const {requireAuth , checkUser} = require('./middlware/authMiddleware');

//middelware  
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// mongoose

mongoose.connect('mongodb+srv://ismailmanhou:ismailmanhou@cluster0.cvb5k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
})
    .then(() => {
        app.listen(PORT, () => console.log('App working on PORT ' + PORT + '...'));
    })
    .catch((e) => console.error('Failed :(' + e));


app.get('/', (req, res) => {
    res.redirect('/all-articles');
});



// all-articles PATH
app.get('*', checkUser);

//add article 
app.get('/addNewArticle',requireAuth,(req, res) => {
    res.render('addNewArticle', { pageTitle: 'أضف موضوع جديد' });
});
app.get('/register', requireAuth ,(req, res) => {
    res.render('register', { pageTitle: ' التسجيل' });
});
app.get('/login', (req, res) => {
    res.render('login', { pageTitle: ' تسجيل الدخول' });
});
app.use('/all-articles',articleRouter);
app.use(userRouter);


//  404
app.use((req, res) => {
    res.status(404).send('نعتذر لا توجد هذه الصفحة  ');
});




