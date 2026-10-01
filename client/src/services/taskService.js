import api from "./api";

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", {
    params,
  });

  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(
    `/tasks/${id}`
  );

  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post(
    "/tasks",
    data
  );

  return response.data;
};

export const updateTask = async (
  id,
  data
) => {
  const response = await api.put(
    `/tasks/${id}`,
    data
  );

  return response.data;
};

export const assignUserToTask = async (
  id,
  userId
) => {
  const response = await api.put(
    `/tasks/${id}/assign`,
    { userId }
  );

  return response.data;
};

export const unassignUserFromTask = async (
  id
) => {
  const response = await api.put(
    `/tasks/${id}/unassign`
  );

  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(
    `/tasks/${id}`
  );

  return response.data;
};

export const getComments = async (taskId) => {
  const response = await api.get(
    `/tasks/${taskId}/comments`
  );

  return response.data;
};

export const addComment = async (
  taskId,
  content
) => {
  const response = await api.post(
    `/tasks/${taskId}/comments`,
    { content }
  );

  return response.data;
};