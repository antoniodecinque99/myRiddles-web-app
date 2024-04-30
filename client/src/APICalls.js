const backendURL = "http://localhost:3001";

async function doLogin(username, password) {

    const requestObject = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    };

    try {
        const response = await fetch(backendURL + "/api/login", requestObject);
        if (!response.ok) {
            return false;
        }

        return await response.json();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function doLogout() {
    try {
        const response = await fetch(backendURL + "/api/logout", {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getSession() {
    try {
        const response = await fetch(backendURL + "/api/session", {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const user = await response.json();
            return user;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getUserStats(username) {
    try {
        const requestObject = {
            method: "GET",
            credentials: "include",
        };
        
        const response = await fetch(backendURL + "/api/userstats/" + username, requestObject);

        if (response.ok) {
            const stats = await response.json();
            return stats;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getTopUsers() {
    try {
        const response = await fetch(backendURL + "/api/topUsers", {
            method: "GET",
        });

        if (response.ok) {
            const topUsers = await response.json();
            return topUsers;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getRiddle(question) {
    try {
        const requestObject = {
            method: "GET",
            credentials: "include",
        };

        const response = await fetch(backendURL + "/api/riddle/" + question.replace("?", "%3F"), requestObject);

        if (response.ok) {
            const riddle = await response.json();
            return riddle;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getClosedRiddles() {
    try {
        const response = await fetch(backendURL + "/api/riddles/closed", {
            method: "GET",
        });

        if (response.ok) {
            const riddles = await response.json();
            return riddles;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getOpenRiddles() {
    try {
        const response = await fetch(backendURL + "/api/riddles/open", {
            method: "GET",
        });

        if (response.ok) {
            const riddles = await response.json();
            return riddles;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getMyOpenRiddles(username) {
    try {
        const response = await fetch(backendURL + "/api/riddles/open/" + username, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const riddles = await response.json();
            return riddles;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function getAnswers(question) {
    try {
        const requestObject = {
            method: "GET",
            credentials: "include",
        };

        const response = await fetch(backendURL + "/api/riddles/answers/" + question.replace("?", "%3F"), requestObject);

        if (response.ok) {
            const answers = await response.json();
            return answers;
        }
        return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function putRiddle(riddle) {
    try {
        const res = await fetch(backendURL + "/api/riddle/", {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: riddle.question,
                level: riddle.level,
                duration: riddle.duration,
                correct_answer: riddle.correct_answer,
                hint_1: riddle.hint_1,
                hint_2: riddle.hint_2
            })
        });

        if (res.ok) {
            return true;
        } else {
            return res.error;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function putAnswer(question, answer) {
    try {
        const res = await fetch(backendURL + "/api/answer/", {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                answer: answer
            })
        });

        let message = await res.json()
        if (res.ok) {
            return message;
        } else {
            return res.error;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function putTimestampFirstAnswer(question) {
    try {
        const res = await fetch(backendURL + "/api/putTimestamp/", {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question
            })
        });

        let message = await res.json()
        if (res.ok) {
            return message;
        } else {
            return res.error;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { doLogin, doLogout, getSession, getUserStats, getTopUsers, getClosedRiddles, getRiddle, getOpenRiddles, getMyOpenRiddles, getAnswers, putRiddle, putAnswer, putTimestampFirstAnswer }