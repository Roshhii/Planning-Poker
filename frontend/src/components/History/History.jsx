import { useState } from "react";
import "./History.css";


function HistoryItem(props) {
    return (
        <div class="historyItem_container">
            <div class="historyItem_post">
                <div class="historyItem_copy">
                    <h3>{props.date}</h3>
                    <p>{props.userStory}</p>
                    <p>{props.tasks}</p>
                    <div class="history-votes-grid-child">{props.votes}</div>
                </div>
            </div>
        </div>
    );
}

function VoteItem(props) {
    return (
        <div className="vote">
            <button className="card">
                {props.card}
            </button>
            <p>{props.name}</p>
        </div>
    )

}

function History({ socket }) {

    var [sessionsDisplay, setSessionsDisplay] = useState(list_sessionsDisplay);

    let tasks = ""
    let userStory = ""

    var list_sessionsDisplay = []
    var list_votesDisplay = []

    const history = JSON.parse(localStorage.getItem("sessions"))

    for (let hist in history) {
        for (let task in hist.tasks) {
            tasks += task + "; "
        }
        for (let story in hist.userStory) {
            userStory += userStory + "; "
        }
        for (let vote in hist.votes) {
            list_votesDisplay.push(<VoteItem
                name={vote.name}
                card={vote.card}
            />);
        }
        list_sessionsDisplay.push(<HistoryItem
            date = {hist.date}
            userStory = {userStory}
            tasks = {tasks}
            votes = {list_votesDisplay}
        />);
        tasks = ""
        userStory = ""
        list_votesDisplay = []
    }

    list_sessionsDisplay = <div class="sessions-grid-child">{list_sessionsDisplay} </div>
    setSessionsDisplay({list_sessionsDisplay})

    return (
        <div className="history-container">
            <h1>History page</h1>
            <p>You sessions:</p>
            <div className="history-items-container">{sessionsDisplay}</div>
        </div>
    );
};

export default History;