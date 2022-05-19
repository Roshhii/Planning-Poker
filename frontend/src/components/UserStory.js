import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom"
import './UserStory.css';



function UserStory( {socket} ) {
    const param = useParams();
    const [titleUserStory, setTitleUserStoryy] = useState();
    const [descriptionUserStory, setDescriptionUserStory]  = useState();

    function UserStoryForm() {

        const [title, setTitle] = useState();
        const [description, setDescription] = useState();
    
        const handleSubmitTitle = (evt) => {
            evt.preventDefault();
            setTitleUserStoryy(title)
        }
    
        const handleChangeTitle = (evt) => {
            evt.preventDefault();
            setTitle(evt.target.value)
        }
    
        const handleSubmitDescription = (evt) => {
            evt.preventDefault();
            setDescriptionUserStory(description)
        }
    
        const handleChangeDescription = (evt) => {
            evt.preventDefault();
            setDescription(evt.target.value)
        }
    
        
    
        return (
            <div>
            <form onSubmit={handleSubmitTitle}>
    
                <input
                    type="text"
                    placeholder="Enter a User Story"
                    value={title}
                    onChange={handleChangeTitle}
                />
                <input type="submit" value="Create" />
                
            </form>
            <form onSubmit={handleSubmitDescription}>
    
                <input
                    type="text"
                    placeholder="Enter Tasks"
                    value={description}
                    onChange={handleChangeDescription}
                />
                <input type="submit" value="Create" />
                
            </form>
            
            </div>
            
        );
    }
    
    function JiraImport() {
        const [file, setFile] = useState()
        const [XMl, setXML] = useState()
        var parser, xmlDoc;
    
        function handleChange(event) {
          setFile(event.target.files[0])
        }
    
        function handleSubmit(event) {
          event.preventDefault()
    
          const reader = new FileReader()
          reader.onload = function(evt) {
            setXML(evt.target.result);
          };
          reader.readAsText(file);
          
          //import Jira to USER STORY TEXT
        }
    
        function handleClick(){
          console.log(typeof XMl)
          parser = new DOMParser();
          xmlDoc = parser.parseFromString(XMl,"text/xml");
          
          setTitleUserStoryy(xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("summary")[0].childNodes[0].nodeValue);
          var str = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("description")[0].childNodes[0].nodeValue
          setDescriptionUserStory(str.substring(3,str.length-4))
    
        }
    
        return (
          <div className="App">
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleChange} />
              <button type="submit">Upload</button>
              <button onClick={handleClick}>Create</button>
            </form>
          </div>
        );
      };

      const handleClick = ()  => {
        console.log(titleUserStory)
        console.log(descriptionUserStory)
        socket.emit("UserForm",
            JSON.stringify({
                "session_id": param.id,
                "title": titleUserStory,
                "description" : descriptionUserStory
            }));
        }

    


    return (
        <div className="UserStory">
            <div class="container">
                <h1>
                    User Story
                </h1>
                <div><h2 className="id">Session Id : {param.id}</h2></div>
                <div><UserStoryForm /></div>
                <div><JiraImport/></div>
                <p>User Story : {titleUserStory}</p>
                <p>Tasks : {descriptionUserStory}</p>
                <button className="button" onClick={handleClick}>Confirm</button>
                <NavLink id="nav-link-Planning" to={`/Planning_poker/${param.id}`}>
                    -- Back to Planning Poker --
                </NavLink>
            </div>
        </div>
    );
}

export default UserStory;