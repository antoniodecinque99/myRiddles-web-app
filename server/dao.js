'use strict'

const sqlite = require('sqlite3')
const { MyRiddle } = require('./class/myRiddle')

const { Answer } = require('./class/answer')
const { User } = require('./class/user')

const crypto = require("crypto")
const { getCurrentTime } = require('./db_utils')

const dbname = "database.sqlite"

const db = new sqlite.Database(dbname, (err) => {
    if (err) {
        throw err
    }
})

async function insertRiddle(riddle) {
    return new Promise((resolve, reject) => {
        const sql = 'insert into riddles (id, question, level, duration, correct_answer, hint_1, hint_2, author, timestamp, winner, timestamp_first_answer) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL) '
        db.all(sql, [riddle.question, riddle.level, riddle.duration, riddle.correct_answer, riddle.hint_1, riddle.hint_2, riddle.author, getCurrentTime()], async (err, data) => {
            if (err) {
                reject(err)
            }
            return resolve(riddle)
        })
    })
}

async function getRiddle(question) {
    return new Promise(async (resolve, reject) => {
        const sql = 'select * from riddles where question = ? '
        db.all(sql, [question], async (err, data) => {
            if (err) reject(err)

            let r = data[0]
            if (r === undefined || r.length == 0) {
                reject("Not existing riddle")
                return
            }

            let riddle = new MyRiddle(r.question, r.level, r.duration, r.correct_answer, r.hint_1, r.hint_2, r.author, null, r.timestamp, r.winner, r.timestamp_first_answer)
            return resolve(riddle)
        })
    })
}

async function getRiddleID(question) {
    return new Promise(async (resolve, reject) => {
        const sql = 'select id from riddles where question = ? '
        db.all(sql, [question], async (err, data) => {
            if (err) reject(err)
            return resolve(data[0].id)
        })
    })
}

async function getMyRiddles(status, username, requesting_user) {
    return new Promise(async (resolve, reject) => {
        if (status == 0 && requesting_user != username) {
            return reject("Unauthorized access")
        }
        var sql
        if (status == 0) {
            sql = 'select * from riddles where author = ? and (timestamp_first_answer is null or ((? - timestamp_first_answer) < duration and winner is null)) order by timestamp desc'
        } else if (status == 1) {
            sql = 'select * from riddles where author = ? and ((timestamp_first_answer is not null and (? - timestamp_first_answer) > duration) or winner is not null) order by timestamp desc'
        }
        db.all(sql, [username, getCurrentTime()], async (err, data) => {
            if (err) reject(err)
            let riddles = []

            for (let r of data) {
                let riddle = new MyRiddle(r.question, r.level, r.duration, r.correct_answer, r.hint_1, r.hint_2, r.author, status, r.timestamp, r.winner, r.timestamp_first_answer)
                riddles.push(riddle)
            }
            return resolve(riddles)
        })
    })
}

async function getAllRiddles(status) {
    return new Promise(async (resolve, reject) => {
        var sql
        if (status == 0) {
            sql = 'select * from riddles where timestamp_first_answer is null or ((? - timestamp_first_answer) < duration and winner is null) order by timestamp desc'
        } else if (status == 1) {
            sql = 'select * from riddles where (timestamp_first_answer is not null and (? - timestamp_first_answer) > duration) or winner is not null order by timestamp desc'
        }
        
        db.all(sql, [getCurrentTime()], async (err, data) => {
            if (err) reject(err)
            let riddles = []

            for (let r of data) {
                let riddle = new MyRiddle(r.question, r.level, r.duration, r.correct_answer, r.hint_1, r.hint_2, r.author, status, r.timestamp, r.winner, r.timestamp_first_answer)
                if (status == 0) riddle.correct_answer = null

                riddles.push(riddle)
            }
            return resolve(riddles)
        })
    })
}

async function closeRiddle(riddleID, username) {
    return new Promise(async (resolve, reject) => {
        const sql = 'update riddles set status = 1, winner = ? where id = ?;'
        db.all(sql, [username, riddleID], (err, data) => {
            if (err) reject(err)
            resolve(true)
        })
    })
}

async function updateUserScore(username, scoreToAdd) {
    return new Promise(async (resolve, reject) => {
        const sql = 'update users set score = score + ? where username = ? '
        db.all(sql, [scoreToAdd, username], (err, data) => {
            if (err) reject(err)
            resolve(true)
        })
    })
}

async function setWinner(question, username) {
    return new Promise(async (resolve, reject) => {
        const sql = 'update riddles set winner = ? where question = ? '
        db.all(sql, [username, question], (err, data) => {
            if (err) reject(err)
            resolve(true)
        })
    })
}

async function setTimestampFirstAnswer(question) {
    let now = getCurrentTime()

    return new Promise(async (resolve, reject) => {
        const sql = 'update riddles set timestamp_first_answer = ? where question = ? and timestamp_first_answer is null'
        db.all(sql, [now, question], (err, data) => {
            if (err) reject(err)
            resolve(true)
        })
    })
}

async function insertAnswer(question, answer, username) {
    return new Promise(async (resolve, reject) => {
        var riddle
        try {
            riddle = await getRiddle(question)
        } catch (err) {
            reject(err)
            return
        }

        if (riddle.timestamp_first_answer != null && getCurrentTime() - riddle.timestamp_first_answer > riddle.duration) {
            reject("Expired riddle")
            return
        }

        if (riddle.author == username) {
            reject("Cannot answer own user riddle")
            return
        }

        const riddleID = await getRiddleID(riddle.question)

        let already_answered
        try {
            const sql = 'select * from answers where id_riddle = ? and author = ?'
            already_answered = await new Promise((resolve, reject) => {
                db.all(sql, [riddleID, username], async (err, data) => {
                    if (err) reject(err)

                    if (data === undefined || data.length == 0)
                        return resolve(false)
                    else return resolve(true)
                })
            })
        } catch (err) {
            return reject(err)
        }
        if (already_answered == true) return reject("Already answered riddle!")

        const sql = 'insert into answers (id_riddle, answer, author, timestamp) values (?, ?, ?, ?) '
        db.all(sql, [riddleID, answer, username, getCurrentTime()], async (err, data) => {
            if (err) {
                reject(err)
                return
            }
            console.log(riddle + "hi")
            if (riddle.timestamp_first_answer == null) {
                await setTimestampFirstAnswer(riddle.question)
            }

            if (answer != undefined && riddle.correct_answer.toString().toLowerCase() == answer.toString().toLowerCase()) {
                const scoreToAdd = riddle.level

                const updated = await updateUserScore(username, scoreToAdd) && await setWinner(question, username)

                if (updated)
                    return resolve("Correct answer! You gained " + riddle.level + " points")
            }
            else {
                return resolve("Wrong answer!")
            }
        })
    })
}

async function getAnswers(question, username) {
    return new Promise(async (resolve, reject) => {
        let riddle
        try {
            riddle = await getRiddle(question)
        } catch (err) {
            reject(err)
            return
        }

        // if (riddle.status == 0 && riddle.author != username) {
        //     reject("Unauthorized - Riddle still open")
        //     return
        // }

        const riddleID = await getRiddleID(riddle.question)
        const sql = 'select * from answers where id_riddle = ? '
        db.all(sql, riddleID, async (err, data) => {
            if (err) reject(err)

            let answers = []
            for (let a of data) {
                let answer = new Answer(a.answer, a.author, a.timestamp)
                answers.push(answer)
            }
            return resolve(answers)
        })
    })
}


async function getTopUsers() {
    return new Promise(async (resolve, reject) => {
        const sql = 'select username, score from users order by score desc limit 3 '
        db.all(sql, (err, data) => {
            if (err) reject(err)

            let users = []
            for (let u of data) {
                let user = new User(u.username, u.score)
                users.push(user)
            }

            return resolve(users)
        })
    })
}

async function findUser(username) {
    return new Promise(async (resolve, reject) => {
        const sql = 'select * from users where username = ?'
        return db.all(sql, username, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
}

async function getUserStats(username) {
    return new Promise(async (resolve, reject) => {
        const sql = 'select username, score from users where username = ?'
        return db.all(sql, username, (err, data) => {
            if (err) reject(err)
            resolve(data[0])
        })
    })
}

async function getUser(username, password) {
    return findUser(username).then(users => {
        let user = users[0]
        console.log(user)

        // psw verification
        return new Promise((resolve, reject) => {
            if (user == undefined) resolve(false)
            crypto.scrypt(password, Buffer.from(user.salt, 'hex'), 255, (err, hashed) => {
                if (err) reject(err)

                if (!crypto.timingSafeEqual(hashed, Buffer.from(user.hash, 'hex'))) {
                    resolve(false)
                }
                else {
                    resolve(user)
                }
            })
        })
    })
}

module.exports = {
    insertRiddle,
    getMyRiddles,
    getAllRiddles,
    getRiddle,
    getAnswers,
    insertAnswer,
    getTopUsers,
    getUserStats,
    setTimestampFirstAnswer,
    getUser
}