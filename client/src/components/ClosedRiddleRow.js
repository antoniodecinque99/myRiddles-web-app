import moment from 'moment'
import { AnswersList } from './AnswersList'
import LoginContext from '../loginContext'
import { useContext, useEffect, useState } from 'react'

function ClosedRiddleRow(props) {
    const timestamp = props.timestamp
    const posted = moment.unix(timestamp).fromNow()

    const loginContext = useContext(LoginContext)

    const [amIwinner, setAmIwinner] = useState(false)
    useEffect(() => {
        async function load() {
            let amIwinner = (props.winner === loginContext.user.username)
            if (amIwinner) setAmIwinner(true)
        }
        load() // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    const row =
        <>
            <tr>
                <td>{props.question}</td>
                <td>{props.level}</td>
                <td>{props.duration} seconds</td>
                <td>{props.author}</td>
                <td>{posted}</td>
                { amIwinner ? <td style={{ color: "green"}}>{props.winner}</td> 
                : <td>{props.winner}</td> }
            </tr>
            { loginContext.user ?
                <tr>
                    <AnswersList question={props.question} correctAnswer={props.correctAnswer}></AnswersList>
                </tr> : <></>
            }
        </>

    return row
}

export default ClosedRiddleRow