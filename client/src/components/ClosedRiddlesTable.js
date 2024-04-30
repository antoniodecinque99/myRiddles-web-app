import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import ClosedRiddleRow from "./ClosedRiddleRow"
import LoginContext from "../loginContext";


import { getClosedRiddles } from "../APICalls"

function ClosedRiddlesTable(props) {
    const [closedRiddles, setClosedRiddles] = useState([])

    let loginContext = useContext(LoginContext)

    useEffect(() => {
        async function load() {
            let riddles = await getClosedRiddles()
            if (riddles) setClosedRiddles(riddles)
            return riddles
        }
        load()
    }, [])


    return <Table className="table100 ver1">
        <thead>
            <tr>
                <th>Question</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Author</th>
                <th>Posted</th>
                <th>Winner</th>
            </tr>
        </thead>
        <tbody>
            {closedRiddles.map((r) => {
                if (loginContext.user && props.mine === true && loginContext.user.username !== r.author) {
                    return <React.Fragment key={r.question}></React.Fragment>
                }
                else return <ClosedRiddleRow key={r.question}
                    closed={true}
                    question={r.question}
                    level={r.level}
                    duration={r.duration}
                    author={r.author}
                    timestamp={r.timestamp}
                    winner={r.winner ? r.winner : "-"}
                    correctAnswer={r.correct_answer}
                />
            })
            }
        </tbody>
    </Table>
}

export default ClosedRiddlesTable