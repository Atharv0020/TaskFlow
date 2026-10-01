import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getTasks,
} from "../services/taskService";

const Tasks = () => {
  const [tasks, setTasks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const response = await getTasks({
        search,
        status,
      });

      setTasks(
        response?.data?.tasks ||
          response?.data ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();

    loadTasks();
  };

  return (
    <div className="page">
      <h1>Tasks</h1>

      <form
        className="filter-bar"
        onSubmit={handleSearch}
      >
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          <option value="TODO">
            TODO
          </option>

          <option value="IN_PROGRESS">
            IN PROGRESS
          </option>

          <option value="COMPLETED">
            COMPLETED
          </option>
        </select>

        <button type="submit">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="list">
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div
                className="card"
                key={task._id}
              >
                <h3>{task.title}</h3>

                <p>
                  {task.description}
                </p>

                <p>
                  Status:{" "}
                  <strong>
                    {task.status}
                  </strong>
                </p>

                <p>
                  Priority:{" "}
                  <strong>
                    {task.priority}
                  </strong>
                </p>

                <Link
                  to={`/tasks/${task._id}`}
                >
                  View Task
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;