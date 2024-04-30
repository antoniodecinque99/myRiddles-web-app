import moment from 'moment'
import LoginContext from '../loginContext'

import { useContext, useState, useEffect } from "react";
import { Form } from 'react-bootstrap';
import * as API from '../APICalls';


import * as Icon from 'react-bootstrap-icons';

function timeLeft(t) {
  return Math.abs(Math.round(Date.now()/1000) - t)
}

function OpenRiddleRow(props) {
  const timestamp = props.timestamp
  const posted = moment.unix(timestamp).fromNow()

  const row =
    <>
      <tr>
        <td>{props.question}</td>
        <td>{props.level}</td>
        <td>{props.author}</td>
        <td>{posted}</td>
      </tr>
      <tr>
        <AnswerForm setScore={props.setScore} 
          score={props.score}
          question={props.question} 
          duration={props.duration} 
          hint_1={props.hint_1}
          hint_2={props.hint_2}
          timestamp_first_answer={props.timestamp_first_answer}>
        </AnswerForm>
      </tr>
    </>

  return row
}

function AnswerForm(props) {
  const [expanded, setExpanded] = useState(false)
  const [firstOpen, setFirstOpen] = useState(true)

  const [answer, setAnswer] = useState("")
  const [message, setMessage] = useState("")

  const loginContext = useContext(LoginContext)
  const [counter, setCounter] = useState();

  const [showHint1, setShowHint1] = useState(false)
  const [showHint2, setShowHint2] = useState(false)

  const [correct, setCorrect] = useState(false)

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

      if (counter === 0 && !correct) {
        setExpanded(false)
        setMessage("Quiz expired")
      }
      else if (counter === 0 && correct) {
        setExpanded(false)
        setMessage("Correct answer!")
      }
    
      if(counter <= 0.5 * props.duration) setShowHint1(true)
      if(counter <= 0.25 * props.duration) setShowHint2(true)
    
    // console.log(counter)
    return () => clearInterval(timer); 
  }, [counter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function load() {
      setExpanded(false)

      let answers = await API.getAnswers(props.question)
      let already_answered = false
      if (answers.length > 0) {
      for (let a of answers) {
        if (a.author === loginContext.user.username) {
          already_answered = true
          break
        }
      }
      }
      if (already_answered) {
        setMessage("Quiz expired")
        return
      }

      let riddle = await API.getRiddle(props.question)
      if (riddle.timestamp_first_answer != null) {
        setCounter(timeLeft(riddle.timestamp_first_answer + riddle.duration))
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function polling() {
      if (expanded === true) 
      {
        if (props.timestamp_first_answer == null && firstOpen) {
          API.putTimestampFirstAnswer(props.question)
          setFirstOpen(false)
          setCounter(props.duration)
        }
      }
    }
    polling()
  }, [expanded]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (event) => {
    event.preventDefault()
    const message = await API.putAnswer(props.question, answer)
    if (message.includes("Correct answer!")) {

      let userStats = await API.getUserStats(loginContext.user.username)
      let currScore = userStats.score
      props.setScore(currScore)

      setCorrect(true)
      setCounter(0)
    }
    setMessage(message)
    setExpanded(false)
  }

  if (!expanded && message) {
    return <td key={props.question} colSpan={6} className="expand-td">
      {(message.includes("Correct answer!")) ? <p style={{ color: "green" }}>{message}</p>
        : <p style={{ color: "red" }}>{"Quiz expired"}</p> }
    </td>
  }

  if (expanded) {
    return <td key={props.question} colSpan={6} className="expand-td">
      <p className="expand-text-expanded" onClick={() => { setExpanded(false) }}>▾ Hide answering form</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Time left to answer: {counter} seconds</Form.Label>
          <Form.Control style={{ width: "40%" }} value={answer} required={true} placeholder={"...write your answer here"}
            onChange={event => setAnswer(event.target.value)} />
          <Form.Text className="text-muted">
            Think carefully. After submission you won't be able to change your answer. <br></br>
            Hint 1 - { showHint1 ? props.hint_1 : <></>} <br></br>
            Hint 2 - { showHint2 ? props.hint_2 : <></>}
          </Form.Text>
        </Form.Group>
        <br></br>
        <Form.Group className='mb-4'>
          <div>
            <button type="submit" className="btn btn-dark" size="sm">
              <Icon.ArrowRightSquareFill style={{ margin: "5px" }}></Icon.ArrowRightSquareFill> Submit
            </button>
          </div>
        </Form.Group>
      </Form>
    </td>
  }

  return <td key={props.question} colSpan={6} className="expand-td">
    <p className="expand-text" onClick={() => { setExpanded(true) }}>▸ Try to answer this Riddle</p>
  </td>


}

export { OpenRiddleRow }

