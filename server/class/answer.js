'use strict';

class Answer {
    constructor(answer, author, timestamp) {
        this.answer = answer;
        this.author = author;
        this.timestamp = timestamp;
    }
}

module.exports = { Answer }