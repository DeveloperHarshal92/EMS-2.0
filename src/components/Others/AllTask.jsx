import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AllTask = () => {
  const [userData, setUserdata] = useContext(AuthContext);

  const [editTaskInfo, setEditTaskInfo] = useState(null);


  // DELETE TASK
  const handleDeleteTask = (empId, taskIndex) => {
    const updatedEmployees = userData.map((emp) => {
      if (emp.id === empId) {
        const taskToDelete = emp.tasks[taskIndex];
        const updatedTaskCount = { ...emp.taskCount };

        if (taskToDelete.newTask) updatedTaskCount.newTask -= 1;
        if (taskToDelete.active) updatedTaskCount.active -= 1;
        if (taskToDelete.completed) updatedTaskCount.completed -= 1;
        if (taskToDelete.failed) updatedTaskCount.failed -= 1;

        return {
          ...emp,
          tasks: emp.tasks.filter((_, idx) => idx !== taskIndex),
          taskCount: updatedTaskCount,
        };
      }
      return emp;
    });

    setUserdata(updatedEmployees); 
  };

  // START EDIT
  const handleEditClick = (empId, taskIdx, task) => {
    setEditTaskInfo({
      empId,
      taskIdx,
      title: task.title,
      description: task.description,
      date: task.date,
      category: task.category,
    });
  };

  // SAVE EDIT
  const handleSaveEdit = () => {
    const { empId, taskIdx, title, description, date, category } = editTaskInfo;

    const updatedEmployees = userData.map((emp) => {
      if (emp.id === empId) {
        const updatedTasks = [...emp.tasks];

        updatedTasks[taskIdx] = {
          ...updatedTasks[taskIdx],
          title,
          description,
          date,
          category,
        };

        return {
          ...emp,
          tasks: updatedTasks,
        };
      }
      return emp;
    });

    setUserdata(updatedEmployees); 
    setEditTaskInfo(null); 
  };

  return (
    <div className="bg-[#1c1c1c] p-5 rounded mt-10 text-white">
      <h2 className="text-2xl font-semibold mb-5">
        Live Employee Task Manager (Admin)
      </h2>

      {userData?.map((emp, empIdx) => (
        <div key={empIdx} className="mb-6">
          <h3 className="text-xl text-emerald-400 mb-2">{emp.fname}</h3>

          {emp.tasks.length === 0 && (
            <p className="text-gray-400">No tasks assigned</p>
          )}

          {emp.tasks.map((task, taskIdx) => (
            <div
              key={taskIdx}
              className="border border-gray-600 mb-2 py-2 px-4 rounded flex justify-between items-center"
            >
              {editTaskInfo?.empId === emp.id &&
              editTaskInfo?.taskIdx === taskIdx ? (
                <div className="w-full">
                  <input
                    className="w-full mb-1 p-1 bg-black border"
                    value={editTaskInfo.title}
                    onChange={(e) =>
                      setEditTaskInfo({
                        ...editTaskInfo,
                        title: e.target.value,
                      })
                    }
                  />

                  <input
                    className="w-full mb-1 p-1 bg-black border"
                    value={editTaskInfo.category}
                    onChange={(e) =>
                      setEditTaskInfo({
                        ...editTaskInfo,
                        category: e.target.value,
                      })
                    }
                  />

                  <input
                    className="w-full mb-1 p-1 bg-black border"
                    type="date"
                    value={editTaskInfo.date}
                    onChange={(e) =>
                      setEditTaskInfo({
                        ...editTaskInfo,
                        date: e.target.value,
                      })
                    }
                  />

                  <textarea
                    className="w-full mb-1 p-1 bg-black border"
                    value={editTaskInfo.description}
                    onChange={(e) =>
                      setEditTaskInfo({
                        ...editTaskInfo,
                        description: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={handleSaveEdit}
                    className="bg-emerald-500 px-3 py-1 rounded text-sm mt-1"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-400">{task.category}</p>
                    <p className="text-xs text-gray-500">{task.date}</p>

                    <span className="text-xs">
                      {task.newTask && (
                        <span className="text-blue-400">NEW</span>
                      )}
                      {task.active && (
                        <span className="text-yellow-400">ACTIVE</span>
                      )}
                      {task.completed && (
                        <span className="text-green-400">COMPLETED</span>
                      )}
                      {task.failed && (
                        <span className="text-red-400">FAILED</span>
                      )}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEditClick(emp.id, taskIdx, task)
                      }
                      className="bg-blue-500 px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteTask(emp.id, taskIdx)}
                      className="bg-red-500 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AllTask;
