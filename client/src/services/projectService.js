import api from "./api";

// Get all projects
export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// Get single project
export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Create project
export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

// Update project
export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};