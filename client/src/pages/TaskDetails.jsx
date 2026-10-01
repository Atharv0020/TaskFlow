import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getTaskById,
  getComments,
  addComment,
} from "../services/taskService";

const TaskDetails = () => {
  const { id } = useParams();

  const [task, setTask] =
    useState(null);

  const [comments, setComments] =
    useState([]);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const loadData = async () => {
    try {
      const [
        taskResponse,
        commentsResponse,
      ] = await Promise.all([
        getTaskById(id),
        getComments(id),
      ]);

      setTask(
        taskResponse?.data?.task ||
          taskResponse?.task
      );

      setComments(
        commentsResponse?.data?.comments ||
          commentsResponse?.comments ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await addComment(id, comment);

      setComment("");

      loadData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    }
  };

  if (loading) {
    return (
      <div className="page">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="page">
        Task not found.
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/tasks">
        ← Back to Tasks
      </Link>

      <div className="card">
        <h1>{task.title}</h1>

        <p>{task.description}</p>

        <p>
          Status: {task.status}
        </p>

        <p>
          Priority: {task.priority}
        </p>

        {task.assignedUser && (
          <p>
            Assigned to:{" "}
            {task.assignedUser.name}
          </p>
        )}
      </div>

      <div className="card">
        <h2>Comments</h2>

        <form
          onSubmit={handleComment}
          className="comment-form"
        >
          <textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

          <button type="submit">
            Add Comment
          </button>
        </form>

        <div className="comments">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((item) => (
              <div
                className="comment"
                key={item._id}
              >
                <strong>
                  {item.userId?.name ||
                    "User"}
                </strong>

                <p>{item.content}</p>

                <small>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;