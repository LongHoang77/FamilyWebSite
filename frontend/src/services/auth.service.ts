interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
}

const login = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const getUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const authService = {
  login,
  logout,
  getToken,
  getUser,
  isAuthenticated,
};
