export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const clearStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};