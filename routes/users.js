const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../helper/catchAsync');
const User = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to My Tour!');
            res.redirect('/tours');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/tours');
})

router.get('/logout', (req, res) => {
    req.logout(function(err){
        if(err){ return next(err);}
        res.redirect('/tours');
    });
    
})



module.exports = router;