const express = require('express');
const router = express.Router();
const passport = require('passport');
const User=require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {storeReturnTo}=require('../middleware');

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // This is a method provided by the User model, which is likely using a library like passport-local-mongoose for handling user authentication.
        // The register method takes two arguments:
        // user: An instance of the User model containing user details like email and username.
        // password: The plain text password provided by the user during registration.
        // it store the user instance and the hashed password in the db.
        req.login(registeredUser, err => {
            // The req.login method is used to establish a login session for the user. It is part of the Passport.js library, which simplifies authentication in Node.js applications.
            // When req.login is called, Passport.js serializes the user information and stores it in the session. This is done using the serializeUser function that you define when configuring Passport.js.
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // passport.authenticate('local', { ... }): Uses Passport.js to authenticate the user with the ‘local’ strategy (typically username and password).
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo||'/campgrounds';
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Goodbye!');
        res.redirect('/campgrounds');
    })
})
module.exports=router;

