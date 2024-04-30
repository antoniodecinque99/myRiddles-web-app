import { useEffect, useState } from "react";
import moment from "moment";

import { getAnswers } from '../APICalls'

import * as API from '../APICalls';

function timeLeft(t) {
    return Math.abs(Math.round(Date.now() / 1000) - t)
}

function AnswersListREALTIME(props) {
    const [answers, setAnswers] = useState([])
    const [expanded, setExpanded] = useState(false)

    const [counter, setCounter] = useState();
    const [triggerCounter, setTriggerCounter] = useState();
    const [message, setMessage] = useState(undefined)

    useEffect(() => {
        async function load_answers() {
            let answers = await getAnswers(props.question)
            if (answers) setAnswers(answers)
            return answers
        }
        load_answers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(expanded && !message) {
        const interval = setInterval(async () => {
            console.log('This will run every second!');
            let answers = await getAnswers(props.question)
            if (answers) setAnswers(answers)
            return answers

        }, 1000);
        return () => clearInterval(interval);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded]);
    

    useEffect(() => {
        async function load_counter() {
            let riddle = await API.getRiddle(props.question)
            if (riddle.timestamp_first_answer != null) {
                setTriggerCounter(true)
                setCounter(timeLeft(riddle.timestamp_first_answer + riddle.duration))
            }
            else {
                setCounter(riddle.duration)
            }
        }
        load_counter()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (triggerCounter) {
            const timer =
                counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

            if (counter === 0) {
                setMessage("Your Riddle has just closed!")
                setTriggerCounter(false)
                setExpanded(false)
            }

            // console.log(counter)
            return () => clearInterval(timer);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    const answerRows = answers.map((a) => {
        return (<p key={a.answer + a.author}>
            <b>Answer: </b>{a.answer}<br></br>
            <b>By: </b>{a.author}<br></br>
            <b>Posted: </b>{moment.unix(a.timestamp).fromNow()}
        </p>)
    })

    if (expanded) {

        return <td key={props.question} colSpan={6} className="expand-td">
            {message ? <p className="expand-text-expanded" style={{ color: "red" }} onClick={() => { setExpanded(false) }}>▾ This Riddle has just closed. Click to hide details</p>
                : <p className="expand-text-expanded" onClick={() => { setExpanded(false) }}>▾ Hide details</p>}
            <p><b>CORRECT ANSWER: </b> {props.correct_answer}<br></br>
                <b>Hint 1: </b>{props.hint_1}<br></br>
                <b>Hint 2: </b>{props.hint_2}</p>
            <b>Time left: </b>{counter} seconds<br></br><br></br>
            {answerRows}
        </td>
    }

    return <td key={props.question} colSpan={6} className="expand-td">
        {message ? <p className="expand-text" style={{ color: "red" }} onClick={() => { setExpanded(true) }}>▸ This Riddle has just closed. Click to show details </p>
            : <p className="expand-text" onClick={() => { setExpanded(true) }}>▸ Show details</p>}
    </td>

}

export { AnswersListREALTIME }