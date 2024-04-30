'use strict';

class MyRiddle {
    constructor(question, level, duration, correct_answer, hint_1, hint_2, author, status=0, timestamp=null, winner=null, timestamp_first_answer) {
        this.question = question;
        this.level = level;
        this.duration = duration;
        this.correct_answer = correct_answer;
        this.hint_1 = hint_1;
        this.hint_2 = hint_2;
        this.author = author;
        this.status = status;
        this.timestamp = timestamp;
        this.winner = winner;
        this.timestamp_first_answer = timestamp_first_answer
    }
}

module.exports = { MyRiddle }