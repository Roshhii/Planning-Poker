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
    

    const history = localStorage.getItem("history")

    
    
    var list_sessionsDisplay = []

    for (let hist of JSON.parse(history)) {
        var list_votesDisplay = []
        var tasks = "Tasks : "
        var userStory = "UserStories : "
        for (let task of hist.tasks) {
            tasks += task + "; "
        }
        for (let story of hist.userStory) {
            userStory += story + "; "
        }
        for (let vote of hist.votes) {
            list_votesDisplay.push(<VoteItem
                name={vote.name}
                card={vote.card}
            />);
        }
        list_sessionsDisplay.push(<HistoryItem
            date={"Date : "+ hist.date}
            userStory={userStory}
            tasks={tasks}
            votes={list_votesDisplay}
        />);
        
    }

    console.log("list_sessionsDisplay : " + list_sessionsDisplay)

    let sessionsDisplay = <div class="sessions-grid-child">{list_sessionsDisplay} </div>

    return (
        <div className="history-container">
            <h1>History page</h1>
            <p>You sessions:</p>
            <div className="history-items-container">{sessionsDisplay}</div>
        </div>
    );
};

export default History;