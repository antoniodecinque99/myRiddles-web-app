'use strict';

const express = require('express');
const sqlite = require('sqlite3');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require("crypto");
const session = require('express-session');

const dbname = "database.sqlite"

const db = new sqlite.Database(dbname, (err) => {
  if (err) {
    throw err;
  }
});

const dao = require('./dao');
const db_utils = require('./db_utils');

// init express
const app = new express();

app.use(morgan('common'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: "GET,HEAD,PUT,POST,DELETE"
};
app.use(cors(corsOptions));

//session init
const { initSession, initAuthentication, isAuthenticated } = require("./authentication");
initSession(app);

//auth init
initAuthentication();

//json init
app.use(express.json());

app.post("/api/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the isAuthenticatedd user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.delete("/api/logout", isAuthenticated, (req, res, next) => {
  req.logout(() => {
    res.end();
  });
});

app.get("/api/session", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.user);
})


// PUT populateUsers
app.put('/api/populateUsers', (req, res) => {
  db_utils.populateUsers().then(
    (val) => { res.json(val) }
  ).catch(
    (err) => { res.status(500).json({ error: err }) }
  )
})

const { MyRiddle } = require('./class/myRiddle')

// PUT riddle
app.put('/api/riddle', isAuthenticated, (req, res) => {
  let riddle = new MyRiddle(req.body.question, req.body.level, req.body.duration, req.body.correct_answer, req.body.hint_1, req.body.hint_2, req.user.username)
  dao.insertRiddle(riddle).then(() => {
    return res.sendStatus(200)
  }).catch(
    (err) => { res.status(500).json({ error: err }); }
  )
})

// GET all OPEN riddles
app.get('/api/riddles/open', (req, res) => {
  dao.getAllRiddles(0).then(
    (value) => { res.json(value); }
  ).catch(
    (err) => { res.status(500).json({ error: err }); }
  );
})

// GET all CLOSED riddles
app.get('/api/riddles/closed', (req, res) => {
  dao.getAllRiddles(1).then(
    (value) => { res.json(value); }
  ).catch(
    (err) => { res.status(500).json({ error: err }); }
  );
})

// Get my OPEN riddles
app.get('/api/riddles/open/:username', isAuthenticated, (req, res) => {
  dao.getMyRiddles(0, req.params.username, req.user.username).then(
    (value) => { res.json(value); }
  ).catch(
    (err) => { res.status(500).json({ error: err }); }
  );
})

// // GET my CLOSED riddles
// app.get('/api/riddles/closed/detailed', isAuthenticated, (req, res) => {
//   dao.getMyRiddles(1, req.user.username).then(
//     (value) => { res.json(value); }
//   ).catch(
//     (err) => { res.status(500).json({ error: err }); }
//   );
// })

// GET a specific riddle
app.get('/api/riddle/:question', isAuthenticated, (req, res) => {
  dao.getRiddle(req.params.question).then(
    (value) => { res.json(value); }
  ).catch(
    (err) => { res.status(500).json({ error: err }); }
  );
})

// PUT Answer riddle
app.put('/api/answer', isAuthenticated, (req, res) => {
  dao.insertAnswer(req.body.question, req.body.answer, req.user.username)
    .then((value) => { return res.status(200).json(value); })
    .catch(
      (err) => { res.status(500).json({ error: err }); }
    )
})

// GET Answer List for riddle
app.get('/api/riddles/answers/:question', isAuthenticated, (req, res) => {
  dao.getAnswers(req.params.question, req.user.username)
    .then((value) => {
      return res.status(200).json(value);
    })
    .catch(
      (err) => { res.status(500).json({ error: err }); }
    )
})

// GET Users with highest scores
app.get('/api/topUsers', (req, res) => {
  dao.getTopUsers().then(
    (value) => { res.json(value); }
  ).catch(
    (err) => { res.status(500).json({ error: err }); }
  );
})

app.get('/api/userstats/:user', (req, res) => {
  dao.getUserStats(req.params.user)
    .then((value) => { res.json(value); }
    ).catch(
      (err) => {
        res.status(500).json({ error: err }) }
  )
})

app.put('/api/putTimestamp', (req, res) => {
  dao.setTimestampFirstAnswer(req.body.question)
  .then((value) => { res.json(value); }
    ).catch(
      (err) => {
        res.status(500).json({ error: err }) }
  )
})

const port = 3001;
// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

