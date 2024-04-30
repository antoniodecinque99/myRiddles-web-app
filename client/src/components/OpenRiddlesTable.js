import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { OpenRiddleRow } from "./OpenRiddleRow"


import { getOpenRiddles } from "../APICalls"
import LoginContext from "../loginContext";

function OpenRiddlesTable(props) {
    const [openRiddles, setOpenRiddles] = useState([])


    const loginContext = useContext(LoginContext)

    useEffect(() => {
        async function load() {
            let riddles = await getOpenRiddles()
            if (riddles) setOpenRiddles(riddles)
            return riddles
        }
        load()
    }, [props.loaded])

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
                if (loginContext.user.username !== r.author)
                return <OpenRiddleRow 
                    key={r.question}
                    question={r.question}
                    level={r.level}
                    duration={r.duration}
                    hint_1={r.hint_1}
                    hint_2={r.hint_2}
                    author={r.author}
                    timestamp={r.timestamp}
                    timestamp_first_answer={r.timestamp_first_answer}

                    score={props.score}
                    setScore={props.setScore}/>
                else return <React.Fragment key={r.question}/>
            })
            }
        </tbody>
    </Table>
}

export default OpenRiddlesTable