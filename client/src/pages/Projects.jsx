import { useEffect, useState } from "react";

import {
  getProjects,
  createProject,
} from "../services/projectService";

const Projects = () => {
  const [projects, setProjects] =
    useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const loadProjects = async () => {
    try {
      const response =
        await getProjects();

      setProjects(
        response?.data?.projects ||
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
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createProject({
        title,
        description,
      });

      setTitle("");
      setDescription("");

      loadProjects();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Project creation failed"
      );
    }
  };

  return (
    <div className="page">
      <h1>Projects</h1>

      <form
        className="form-card"
        onSubmit={handleCreate}
      >
        <input
          placeholder="Project title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button type="submit">
          Create Project
        </button>
      </form>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="list">
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            projects.map((project) => (
              <div
                className="card"
                key={project._id}
              >
                <h3>{project.title}</h3>

                <p>
                  {project.description ||
                    "No description"}
                </p>

                <small>
                  Status:{" "}
                  {project.status || "ACTIVE"}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;