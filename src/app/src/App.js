import React, { useState, useEffect } from "react";
import "./App.css";
import RenderList from "./components/RenderList";
import RenderForm from "./components/RenderForm";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupMessage, setPopupMessage] = useState(null);


  const renderList = () => {
    fetch("http://localhost:8000/todos/")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          setTodos(["Learn Docker", "Learn React"]); // Set hardcoded todos
        }
      })
      .catch((error) => {
        alert("Error fetching todos");
      });
  };

  useEffect(() => {
    // Load todos from DB on initial render
    renderList();
  }, []);

  const UpdateTodo = (newTodo) => {
    if(newTodo === "") {
      setPopupMessage("Please enter a task");
      setTimeout(() => {
        setPopupMessage(null);
      }, 3000);
      return;
    }
    fetch("http://localhost:8000/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry: newTodo }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.message);
        renderList();
        setPopupMessage(data.message);
        // Clear the popup message after 3 seconds
        setTimeout(() => {
          setPopupMessage(null);
        }, 3000);
      })
      .catch((error) => {
        alert("Error adding todo!");
      });
  };

  const deleteList = () => {
    fetch("http://localhost:8000/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delete: "delete" }),
    })
      .then((response) => response.json())
      .then((data) => {
        // After a successful DELETE request, fetch the updated todos
        renderList();
        setPopupMessage("List deleted successfully");
        // Clear the popup message after 3 seconds
        setTimeout(() => {
          setPopupMessage(null);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <div className="App">
      {popupMessage && (
      <div className="popup-message">
        {popupMessage}
      </div>
      )}
      <div className="row">
        <div className="col-8"><RenderList todos={todos} /></div>
        <div className="col-4"><RenderForm addItem={UpdateTodo} onDeleteList={deleteList} /></div>
      </div>
    </div>
  );
}

export default App;
