'use strict';

const sqlite = require('sqlite3');
const crypto = require("crypto");

const dbname = "database.sqlite"
const User = require('./class/user')

const db = new sqlite.Database(dbname, (err) => {
    if (err) {
        throw err;
    }
});

function getCurrentTime() {
    return Math.round(new Date()/1000);
}

function populateUsers() {
    return new Promise((resolve, reject) => {
        let users = [
            {
                username: "TonyCreative",
                hash: "",
                salt: "",
                score: 0
            },
            {
                username: "Heller99",
                hash: "",
                salt: "",
                score: 0
            },
            {
                username: "Hyades97",
                hash: "",
                salt: "",
                score: 0
            },
            {
                username: "dazzai_sd",
                hash: "",
                salt: "",
                score: 0
            },
            {
                username: "Monny01",
                hash: "",
                salt: "",
                score: 0
            },
        ];

        const password = "12345";

        for (let u of users) {
            let salt = crypto.randomBytes(32);
            u.salt = salt;
            
            crypto.scrypt(password, salt, 255, (err, hash) => {
                u.hash = hash;

                db.all("insert into users(username, hash, salt, score) VALUES (?, ?, ?, ?) ",
                    u.username, u.hash, u.salt, u.score,
                    (err, rows) => {
                        if (err) reject(err);
                    });
            });
        }
        resolve(users.map(u => u.username ));
    });
}

module.exports = { getCurrentTime, populateUsers };