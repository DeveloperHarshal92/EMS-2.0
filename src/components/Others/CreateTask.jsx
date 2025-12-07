import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";

const CreateTask = () => {
  const [userData, setUserdata] = useContext(AuthContext);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [category, setCategory] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userData) return;

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      category: category,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    };

    const updatedEmployees = userData.map((emp) => {
      if (emp.fname === assignTo) {
        return {
          ...emp,
          tasks: [...emp.tasks, newTask],
          taskCount: {
            ...emp.taskCount,
            newTask: emp.taskCount.newTask + 1,
          },
        };
      }
      return emp;
    });

    setUserdata(updatedEmployees);

    setUserdata(updatedEmployees);

    setTaskTitle("");
    setTaskDate("");
    setAssignTo("");
    setCategory("");
    setTaskDescription("");
  };

  return (
    <div>
      <div className="p-5 bg-[#1c1c1c] mt-7 rounded">
        <form
          onSubmit={submitHandler}
          className="flex flex-wrap w-full items-center justify-between text-white"
        >
          <div className="w-1/2">
            <div>
              <h3 className="text-sm text-gray-300 mb-0.5">Task Title</h3>
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4"
                type="text"
                placeholder="Make a UI design"
                required
              />
            </div>

            <div>
              <h3 className="text-sm text-gray-300 mb-0.5">Date</h3>
              <input
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4"
                type="date"
                required
              />
            </div>

            <div>
              <h3 className="text-sm text-gray-300 mb-0.5">Assign to</h3>
              <input
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4"
                type="text"
                placeholder="Employee Name"
                required
              />
            </div>

            <div>
              <h3 className="text-sm text-gray-300 mb-0.5">Category</h3>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border border-gray-400 mb-4"
                type="text"
                placeholder="Design, Dev, etc."
                required
              />
            </div>
          </div>

          <div className="w-2/5 flex flex-col items-start">
            <h3 className="text-sm text-gray-300 mb-0.5">Description</h3>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full h-44 text-sm py-2 px-4 rounded outline-none bg-transparent border border-gray-400"
              placeholder="Enter Details..."
              required
            ></textarea>

            <button className="bg-emerald-500 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
