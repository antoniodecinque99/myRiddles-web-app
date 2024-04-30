import { useEffect, useState } from "react";
import moment from "moment";

import { getAnswers } from '../APICalls'

import LoginContext from "../loginContext";
import { useContext } from "react";

function AnswersList(props) {
    const [answers, setAnswers] = useState([])
    const [expanded, setExpanded] = useState(false)

    const loginContext = useContext(LoginContext);

    useEffect(() => {
        async function load() {
            let answers = await getAnswers(props.question)
            if (answers) setAnswers(answers)
            return answers
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const answerRows = answers.map((a) => {

        if (a.author !== loginContext.user.username )
            return (<p key={a.answer + a.author}>
                <b>Answer: </b>{a.answer}<br></br>
                <b>By: </b>{a.author}<br></br>
                <b>Posted: </b>{moment.unix(a.timestamp).fromNow()}
            </p>)
        else {
            let color
            if (props.correctAnswer.toString().toLowerCase() === a.answer.toString().toLowerCase()) color = "green"
            else color = "red"

            return (<p style={{ color: `${color}` }} key={a.answer}>
            <b>Your answer: </b>{a.answer}<br></br>
            <b>Posted: </b>{moment.unix(a.timestamp).fromNow()}
        </p>)
        } 
    })

    if (expanded) {
        return <td key={props.question} colSpan={6} className="expand-td">
            <p className="expand-text-expanded" onClick={() => { setExpanded(false) }}>▾ Hide details</p>
            <p><b>CORRECT ANSWER: </b> {props.correctAnswer}</p>
            {answerRows}
        </td>

    }

    return <td key={props.question} colSpan={6} className="expand-td">
        <p className="expand-text" onClick={() => { setExpanded(true) }}>▸ Show details</p>
    </td>

}

export { AnswersList }