import React, { useState, useEffect } from "react";
import "../css/renderlist.css"; // Import a CSS file for styling

function RenderList({ todos }) {
  const [completedTodos, setCompletedTodos] = useState({});

  const toggleCompletion = (index) => {
    const updatedCompletedTodos = { ...completedTodos };
    // Toggle the completion status for the clicked item
    updatedCompletedTodos[index] = !updatedCompletedTodos[index];
  
    // Update the state with the new completion status
    setCompletedTodos(updatedCompletedTodos);
  
    // Save the updated state to local storage
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedTodos));
  };

  useEffect(() => {
    // Load the initial state from local storage
    const savedCompletedTodos = JSON.parse(localStorage.getItem("completedTodos")) || {};
    setCompletedTodos(savedCompletedTodos);
  }, []);

  return (
    <div className="list-Container">
      <h1 className="list-title">Your Todos are Here :)</h1>
      <div className="list-box">
        <ul className="list">
          {todos.map((todo, index) => (
            <li
              key={index}
              className={completedTodos[index] ? "completed" : ""}
              onClick={() => toggleCompletion(index)}
            >
              <div className="div-li">{todo}</div> {/* Wrap the todo in a div */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RenderList;
