import { Row, Col, Form } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putRiddle } from '../APICalls';
import { ErrorBox } from "../components/ErrorBox";

import { Riddle } from "../classes/riddle"

function NewRiddlePage(props) {
    const [errorMessage, setErrorMessage] = useState();

    const navigate = useNavigate();

    const [question, setQuestion] = useState("")
    const [level, setLevel] = useState()
    const [duration, setDuration] = useState()
    const [correct_answer, setCorrectAnswer] = useState("")
    const [hint_1, setHint1] = useState("")
    const [hint_2, setHint2] = useState("")

    const handleSubmit = async (event) => {
        let riddle = new Riddle(question, level, duration, correct_answer, hint_1, hint_2)
        
        event.preventDefault();
        const res = await putRiddle(riddle)
        
        if (res) {
            navigate("/myriddles")
        } else {
            setErrorMessage("Riddle already exists")
        }
    }

    const formContent =
        <div className="auth-wrapper">
            <div className="auth-inner">
                <Form onSubmit={handleSubmit}>
                    <h3>Ready to create a new Riddle?</h3>
                    <Form.Group className='mb-3'>
                        <Form.Label>What is the question?</Form.Label>
                        <Form.Control value={question} required={true} placeholder={"question"}
                            onChange={event => setQuestion(event.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Difficulty level</Form.Label>
                        <Form.Control type="number" min={1} max={3} value={level} required={true} placeholder={"..can be between 1 and 3"}
                            onChange={event => setLevel(event.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Duration in seconds</Form.Label>
                        <Form.Control type="number" min={30} max={600} value={duration} required={true} placeholder={"...can be between 30 and 600 seconds"}
                            onChange={event => setDuration(event.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Correct Answer</Form.Label>
                        <Form.Control value={correct_answer} required={true} placeholder={"correct answer"}
                            onChange={event => setCorrectAnswer(event.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>First hint</Form.Label>
                        <Form.Control value={hint_1} required={true} placeholder={"first hint"}
                            onChange={event => setHint1(event.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Second hint</Form.Label>
                        <Form.Control value={hint_2} required={true} placeholder={"second hint"}
                            onChange={event => setHint2(event.target.value)} />
                    </Form.Group>
                    <br></br>
                    <Form.Group className='mb-4' align="center">
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-dark">
                                Submit
                            </button>
                        </div>
                    </Form.Group>
                </Form>
                {errorMessage ? <Row><Col><ErrorBox message={errorMessage}/></Col></Row> : <></>}
            </div>
        </div>

    return formContent

}

export default NewRiddlePage