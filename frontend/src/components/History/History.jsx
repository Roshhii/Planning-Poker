import { useState } from "react";
import "./History.css";


function HistoryItem(props) {
    return (
        <div class="historyItem_post">
            <div class="historyItem_copy">
                <h3 className="date">{props.date}</h3>
                <p>{props.userStory}</p>
                <p>{props.tasks}</p>
                {props.votes}
            </div>
        </div>
    );
}

function VoteItem(props) {
    return (
        <div className="vote">
            <div className="card-vote">
                {props.card}
            </div>
            <strong>{props.name}</strong>
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
        let votesDiplay = <div className="grid-history">{list_votesDisplay}</div>
        list_sessionsDisplay.push(<HistoryItem
            date={"Date : " + hist.date}
            userStory={userStory}
            tasks={tasks}
            votes={votesDiplay}
        />);

    }

    return (
        <div className="body">
            <h2>You sessions:</h2>
            <div className="history-wrapper">
                {list_sessionsDisplay}
            </div>
        </div>

    );
};

export default History;