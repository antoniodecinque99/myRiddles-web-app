import React, { useContext } from "react";
import { Container } from "react-bootstrap";

import ClosedRiddlesTable from "../components/ClosedRiddlesTable";
import OpenRiddlesTable from "../components/OpenRiddlesTable";
import LoginContext from "../loginContext";

function AllRiddles(props) {
    const loginContext = useContext(LoginContext)

    return <Container fluid>
        { loginContext.user ? 
        <>
        <h1>All open Riddles</h1>
        <p>
            Here you can check all the open Riddles. <br></br>
            Start answering one!<br></br>
            You can provide at most one reply to each Riddle, and it cannot be modified.
            <br></br>As you start to answer a riddle, you will see the remaining time. 
            <br></br>If the remaining time is less that 50%, then a first hint will be shown.
            <br></br>If the remaining time is less that 25%, then a second hint will be shown.
            <br></br><br></br>If you give a correct answer, you will get a score of 3, 2, or 1 points, depending on the level: <br></br>
            - 1 point for <b>easy</b> Riddle <br></br>
            - 2 points for <b>average</b> Riddle <br></br>
            - 3 points for <b>difficult</b> Riddle <br></br>
        </p>
        <OpenRiddlesTable loaded={props.loaded} score={props.score} setScore={props.setScore}>
        </OpenRiddlesTable></> : <></>}
        <h1>All closed Riddles</h1>
        <p>Here you can check all the closed Riddles. <br></br>
            <br></br>
            A Riddle becomes <b>closed</b> if: <br></br>
            - a user gives a correct answer <br></br>
            - no user provides the correct answer <br></br>
            <br></br>
            The Riddles are sorted from most recent.
        </p>
        <ClosedRiddlesTable>
        </ClosedRiddlesTable>
        <br></br>
        <br></br>

    </Container>
}

export default AllRiddles;
