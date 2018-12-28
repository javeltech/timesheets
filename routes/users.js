const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('users/login', {login: true});
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/timesheets/add',
    failureRedirect: '/users/login',
    failureFlash: true
  }) (req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
})


module.exports = router;