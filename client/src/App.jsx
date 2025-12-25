// src/App.jsx
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Routes from "./Routes";

// Axios setup for global error handling
import axios from "axios";

function App() {
  // Set up axios interceptors globally
  useEffect(() => {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <Routes />
    </div>
  );
}

export default App;