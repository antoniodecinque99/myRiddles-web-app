import moment from 'moment'
import { AnswersListREALTIME } from './AnswersList_REALTIME'

function MyOpenRiddleRow(props) {
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
          <AnswersListREALTIME setScore={props.setScore} 
            question={props.question} 
            duration={props.duration} 
            hint_1={props.hint_1}
            hint_2={props.hint_2}
            timestamp_first_answer={props.timestamp_first_answer}
            correct_answer={props.correct_answer}>
          </AnswersListREALTIME>
        </tr>
      </>
  
    return row
}

export { MyOpenRiddleRow }