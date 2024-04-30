

class Riddle {
    constructor(question, level, duration, correct_answer, hint_1, hint_2) {
        this.question = question;
        this.level = level;
        this.duration = duration;
        this.correct_answer = correct_answer;
        this.hint_1 = hint_1;
        this.hint_2 = hint_2;
    }
}

module.exports = { Riddle }