import React, { useState, useEffect } from "react";
import logo from './r_logo.png';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import client from "../apolloClient";
import { FiLogOut } from "react-icons/fi";
import { formatLocalTime } from "../utils/formatDateTime";

export default function Reminders() {
  const name  = window.localStorage.getItem("username")
  const [formData, setFormData] = useState({ task: "", time: "" });
  const [tasks, setTasks] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({
      id: "",
      task: "",
      remindAt: ""
    });
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState("");

const convertToUTC = (dateTimeString) => {
  if (!dateTimeString) return null;

  // ✅ If datetime-local has no seconds, append ":00"
  let formatted = dateTimeString;
  if (formatted.length === 16) {
    formatted += ":00";  
  }

  // ✅ Convert LOCAL time to UTC ISO string
  const userDate = new Date(formatted);

  // Offset in minutes → convert to milliseconds
  const timezoneOffset = userDate.getTimezoneOffset() * 60000;

  // ✅ Convert to UTC (add offset because getTimezoneOffset is negative for IST)
  const utcDate = new Date(userDate.getTime() - timezoneOffset);

  return utcDate.toISOString();   // always returns UTC formatted timestamp
};




  
    const ADD_TASK = gql`
    mutation CreateTask($task: String!, $remindAt: DateTime!) {
      createTask(input: { task: $task, remindAt: $remindAt}) {
        task{
          id
          userId
          task
          remindAt
        }
      }
    }
  `;

  const UPDATE_TASK = gql`
    mutation UpdateTask($taskId: ID!, $task: String!, $remindAt: DateTime!) {
      updateTask(input: { taskId: $taskId, task: $task, remindAt: $remindAt}) {
        task{
          id
          task
          remindAt
        }
      }
    }
  `;


    const DELETE_TASK = gql`
    mutation DeleteTask($taskId: ID!) {
      deleteTask(taskId: $taskId) {
      deleted
        task{
          id
          task
          remindAt
        }
      }
    }
  `;

  const VIEW_TASKS = gql`query{
  tasks{
    id
    task
    remindAt
  }
}`


 const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    client.clearStore();              
    window.location.href = "/"; 
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
      e.preventDefault();
      let updatedTime = selectedTask.remindAt;
  if (updatedTime.length === 16) {
    updatedTime = updatedTime + ":00";  // append seconds
  }
    const remindAt = new Date(updatedTime).toISOString();
    updateTask({
      variables:{
        taskId: selectedTask.id,
        task: selectedTask.task,
        remindAt: remindAt,
      }
    });
    setFormData({ task: "", time: "" });
 setUpdateModal(false);
};

  const handleDelete = () => {
    deleteTask({
      variables:{
        taskId: deleteTaskId,
      }
    });
      setDeleteModal(false);
    };

  const [createTask, {data, loading, error}] = useMutation(ADD_TASK, 
    {
  update: (cache, { data: { createTask } }) => {
    const newTask = createTask.task;
    const existing = cache.readQuery({ query: VIEW_TASKS });
    cache.writeQuery({
      query: VIEW_TASKS,
      data: {
        tasks: [...existing.tasks, newTask], 
      },
    });
  },
    onCompleted: () => {
      alert("Task Added");
    },
    onError : (error) =>{
      console.log('error  ',error)
    }
  })



  const [updateTask, { data: u_data,
  loading: u_loading,
  error: u_error}] = useMutation(UPDATE_TASK, {
  update: (cache, { data: { updateTask } }) => {
    const updatedTask = updateTask.task;
    const existing = cache.readQuery({ query: VIEW_TASKS });

    const updatedList = existing.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    cache.writeQuery({
      query: VIEW_TASKS,
      data: {
        tasks: updatedList,
      },
    });
  },
}, {
    onCompleted: () => {
      alert("Task Updated");
    },
    onError : (error) =>{
      console.log('error  ',error)
    }
  })

  
  const [deleteTask, { data: d_data,
  loading: d_loading,
  error: d_error}] = useMutation(DELETE_TASK, {
  update: (cache, { data }) => {
    const existing = cache.readQuery({ query: VIEW_TASKS });
    const filteredTasks = existing.tasks.filter(task => task.id !== deleteTaskId);
    cache.writeQuery({
      query: VIEW_TASKS,
      data: {
        tasks: filteredTasks,
      },
    });
  },
},
{
    onCompleted: (data) => {
      console.log('dat6a    ',data)
      if(data.deleteTask.deleted){
      alert("Task Deleted");
      }
    },
    onError : (error) =>{
      console.log('error  ',error)
    }
  })


  const {  data: t_data,
  loading: t_loading,
  error: t_error} = useQuery(VIEW_TASKS, { fetchPolicy: "cache-and-network" ,
    onCompleted: (data) => {
      console.log('data   ',data.tasks)
    },
    onError : (error) =>{
      console.log('error  ',error)
    }
  })

    useEffect(() => {
    if (t_data?.tasks) {
      setTasks(t_data.tasks);
    }
  




  }, [t_data]);

  const addReminder = (e) => {
    e.preventDefault();
    const remindAt = convertToUTC(formData.time);
    if (!formData.task || !formData.time) return;
    createTask({
      variables:{
        task: formData.task,
        remindAt: remindAt,
      }
    });
    setFormData({ task: "", time: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
            <header className="flex justify-between items-center px-10 shadow-md bg-gradient-to-br from-blue-50 to-blue-200">
        <div > <img src={logo} alt="Remindly Logo" className="w-16 h-16" /></div>
       {name ?
       ( <span className="text-gray-700">
      Hi, {name}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-blue-800 transition"
          title="Logout"
        >
          <FiLogOut size={22} />
        </button>
    </span>)
       : (
        <div className="space-x-6">
          <Link to="/signin" className="text-gray-700 hover:text-blue-600">Sign In</Link>
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
        </div>)
}
      </header>

      {/* Main */}
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Add Reminder</h2>

        <div className="flex gap-3">
          <input
            type="text"
            name="task"
            placeholder="Reminder task"
            value={formData.task}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none"
          />
          {/* <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-40 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none"
          /> */}
           <input type="datetime-local"
            name="time"
            onChange={handleChange}
            value={formData.time} />
          <button
            onClick={addReminder}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
      <div className="max-w-xl mx-auto mt-6 space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-700">{task.task}</p>
              <p className="text-sm text-gray-500">⏰ {formatLocalTime(task.remindAt)}</p>
            </div>
            <div className="space-x-2">
              <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                onClick={() => {
        setSelectedTask({
          id: task.id,
          task: task.task,
          remindAt: task.remindAt,
        });
        setUpdateModal(true); 
      }}
              >
                Update
              </button>
              <button
                onClick={() => {
        setDeleteTaskId(task.id);
        setDeleteModal(true);
      }}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {updateModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white w-96 p-6 rounded-2xl shadow-xl animate-fadeIn">

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Update Task</h2>

      <label className="block mb-2 text-sm font-medium">Task</label>
      <input
        type="text"
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={selectedTask.task}
        onChange={(e) =>
          setSelectedTask({ ...selectedTask, task: e.target.value })
        }
      />

      <label className="block mt-4 mb-2 text-sm font-medium">Reminder Time</label>
      <input
        type="datetime-local"
        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        // value={selectedTask.remindAt?.slice(0, 16)}
        value={selectedTask.remindAt}
        onChange={(e) =>
          setSelectedTask({ ...selectedTask, remindAt: e.target.value })
        }
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          onClick={() => setUpdateModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}


{deleteModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white w-96 p-6 rounded-2xl shadow-xl animate-fadeIn">
      
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Confirm Deletion
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this reminder?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          onClick={() => setDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => handleDelete()}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>



  );



}
