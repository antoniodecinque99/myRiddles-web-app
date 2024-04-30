import { Row, Col, Form } from "react-bootstrap";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doLogin } from '../APICalls';
import LoginContext from "../loginContext";
import { ErrorBox } from "../components/ErrorBox";

function LoginPage(props) {
    
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loginContext = useContext(LoginContext);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault()
        const res = await doLogin(username, password);

        if (res) {
            loginContext.setUser(res);
            props.setScore(res.score)
            props.setLoaded(false)
            navigate("/");
        } else {
            setErrorMessage("Incorrect username or password");
        }
    }

    const formContent =
        <div className="auth-wrapper">
            <div className="auth-inner">
                <Form onSubmit={handleSubmit}>
                    <h3>Start to answer riddles!</h3>
                    <Form.Group className='mb-3'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={username} required={true} placeholder={"Username"}
                            onChange={event => setUsername(event.target.value)} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} required={true} placeholder={"password"}
                            onChange={event => setPassword(event.target.value)} />
                    </Form.Group>

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

export default LoginPage;