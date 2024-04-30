import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import ClosedRiddlesTable from "../components/ClosedRiddlesTable";
import MyOpenRiddlesTable from "../components/MyOpenRiddlesTable";
import LoginContext from "../loginContext";

function AllRiddles(props) {
    const loginContext = useContext(LoginContext)

    return <Container fluid>

        { loginContext.user ? 
        <>
        <h1>My open Riddles</h1>
        <p>
            Here you can check your open Riddles. <br></br>
        </p>
        <MyOpenRiddlesTable score={props.score} setScore={props.setScore}>
        </MyOpenRiddlesTable></> : <></>}
        <h1>My closed Riddles</h1>
        <p>Here you can check your closed Riddles. <br></br>
        </p>
        <ClosedRiddlesTable mine={true}>
        </ClosedRiddlesTable>
        <br></br>
        <br></br>

    </Container>
}

export default AllRiddles;
