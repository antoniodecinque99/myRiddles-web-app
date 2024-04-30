import { Container } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import { Table } from "react-bootstrap";

import { getTopUsers } from "../APICalls";

const LeaderBoard = () => {
    const [topUsers, setTopUsers] = useState([])

    useEffect(() => {
        async function load() {
            let topUsers = await getTopUsers()
            if (topUsers) setTopUsers(topUsers)
            return topUsers
        }
        load()
    }, [])

    return <Container fluid>
        <h1>LeaderBoard</h1>
        These three players have shown great capacity in solving Riddles and they have the highest scores. <br></br><br></br>Don't be discouraged if you're not here.<br></br> With enough practice, everyone can accomplish their goals!
        <Table className="table100 ver1">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                { topUsers.map((u) => (u.score !== 0) ? <LeaderBoardRow key={u.username} username={u.username} score={u.score} /> : <React.Fragment key={u.username}/> ) }
            </tbody>
        </Table >
    </Container>
};

function LeaderBoardRow(props) {
    return <>
        <tr>
            <td>{props.username}</td>
            <td>{props.score}</td>
        </tr>
    </>
}

export default LeaderBoard;
