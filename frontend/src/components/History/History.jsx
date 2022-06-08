import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./History.css";

function History({ socket }) {


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