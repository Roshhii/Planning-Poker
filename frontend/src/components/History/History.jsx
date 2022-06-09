import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./History.css";


function HistoryItem(props) {
    return (
        <div class="historyItem_container">
            <div class="historyItem_post">
                <div class="historyItem_copy">
                    <h3>{props.date}</h3>
                    <p>{props.userStory}</p>
                    <p>{props.tasks}</p>
                    <p>{props.votes}</p>
                </div>
            </div>
        </div>
    );
}

function History({ socket }) {

    var userStory = []
    var tasks = []
    var votes = []

    const localItemUser = JSON.parse(localStorage.getItem("user"))
    let email = localItemUser.email

    const getHistory = () => {
        let infoHistory = axios.get("http://localhost:3001//user/history")
        let msg = JSON.parse(infoHistory);
        userStory = msg.userStory
        tasks = msg.tasks
        votes = msg.votes
    }

    for (var i = 0; i < userStory; i++) {
       
    }



    function renderHistoryItem() {
        return (
            <HistoryItem
                date=""
                userStory=""
                tasks=""
                votes=""
            />
        );
    }

    return (
        <div className="history-container">
            <h1>History page</h1>
            <p>You sessions:</p>
            <ul className="history-items-container">

            </ul>
        </div>
    );
};

export default History;