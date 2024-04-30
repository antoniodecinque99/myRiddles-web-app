import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { MyOpenRiddleRow } from "./MyOpenRiddleRow"


import { getMyOpenRiddles } from "../APICalls"
import LoginContext from "../loginContext";

function MyOpenRiddlesTable(props) {
    const [openRiddles, setOpenRiddles] = useState([])


    const loginContext = useContext(LoginContext)

    useEffect(() => {
        async function load() {
            let riddles = await getMyOpenRiddles(loginContext.user.username)
            if (riddles) setOpenRiddles(riddles)
            return riddles
        }
        load() // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    return <Table className="table100 ver1">
        <thead>
            <tr>
                <th>Question</th>
                <th>Level</th>
                <th>Author</th>
                <th>Posted</th>
            </tr>
        </thead>
        <tbody>
            {openRiddles.map((r) => {
                return <MyOpenRiddleRow 
                    key={r.question}
                    question={r.question}
                    level={r.level}
                    duration={r.duration}
                    hint_1={r.hint_1}
                    hint_2={r.hint_2}
                    author={r.author}
                    timestamp={r.timestamp}
                    timestamp_first_answer={r.timestamp_first_answer}
                    
                    correct_answer={r.correct_answer}
                    />
            })
            }
        </tbody>
    </Table>
}

export default MyOpenRiddlesTable