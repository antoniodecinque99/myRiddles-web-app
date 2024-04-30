'use strict';

const dao = require("./dao");

// Passport-related imports and configurations
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const express = require('express');

function initAuthentication() {
    passport.use(new LocalStrategy(async function verify(username, password, cb) {
        const user = await dao.getUser(username, password);

        if (!user)
           return cb(null, false, 'Incorrect username or password');
     
        return cb(null, {
            username: user.username,
            score: user.score
        });
    }));
}

function initSession(app) {
    app.use(session({
    secret: "Super exam 30L",
    resave: false,
    saveUninitialized: false,
    }));

    app.use(passport.authenticate('session'));

    passport.serializeUser((user, cb) => {
        cb(null, {
            username: user.username,
            score: user.score
        })
      });

    passport.deserializeUser((user, cb) => {
        cb(null, user);
    })
}

function isAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        res.status(401).json({
            message: "Unauthenticated"
        })
    } else {
        next();
    }
}

module.exports = { initAuthentication, initSession, isAuthenticated }
