import React, { useState } from "react";
import "../css/renderform.css"; // Import a CSS file for styling

function RenderForm({ addItem, onDeleteList }) {
  const [todo, setTodo] = useState("");

  const handleInputChange = (event) => {
    setTodo(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addItem(todo);
    setTodo("");
  };

  const handleDeleteList = () => {
    onDeleteList(); // Call the onDeleteList function
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add your Tasks here!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="todo" className="input-title">
            ToDo:{" "}
          </label>
          <input
            type="text"
            id="todo"
            className="todo-input"
            value={todo}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ marginTop: "5px" }}>
          <button id="submit-btn" type="submit" className="todo-button">
            Add Task
          </button>
        </div>
      </form>
      <button id="delete-btn" onClick={handleDeleteList}>Delete List</button> {/* Call handleDeleteList on button click */}
    </div>
  );
}

export default RenderForm;
