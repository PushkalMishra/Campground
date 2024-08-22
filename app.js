if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
console.log(process.env.SECRET)
console.log(process.env.API_KEY)
const e=require('express');
const path=require('path');
const mongoose=require('mongoose');
const engine=require('ejs-mate');
const Joi=require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});
const app=e();


app.engine('ejs', engine);

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs'); 

app.use(e.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(e.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// above line tell the passport to use the localstrategy of username nd password and use authentiction mehtod defined in the user module defined by passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// The serializeUser method provided by passport-local-mongoose serializes(login) the user instance to the session. tell what data should be stored about the user
// The deserializeUser method provided by passport-local-mongoose deserializes the user instance from the session.
app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

app.get('/',(req,res)=>{
    res.render('home')
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000,()=>{
    console.log("listening on the port 3000")
})