import axios from "axios";

const API_URL = "https://armstrong-api.vercel.app/api";

const authProvider = {
  login: async ({ username, password }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: username,
        password,
      });

      const { token, userType } = res.data; // directly get userType from root

      if (!token) throw new Error("No token returned");

      // Check if user is admin
      if (userType !== "Admin") {
        return Promise.reject("Only admin users can login");
      }

      localStorage.setItem("authToken", token);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  },
  logout: () => {
    localStorage.removeItem("authToken");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("authToken")
      ? Promise.resolve()
      : Promise.reject(),
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("authToken");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve(),
};

export default authProvider;
