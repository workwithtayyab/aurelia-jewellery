import API_BASE_URL from "../config";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AdminAuthContext = createContext(null);

const API_URL = `${API_BASE_URL}/api/admin/auth`;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        setAdmin(null);
        return null;
      }

      const data = await response.json();
      setAdmin(data.admin || null);
      return data.admin || null;
    } catch (error) {
      console.error("Admin session verification failed:", error);
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Invalid email or password.",
        };
      }

      setAdmin(data.admin || null);

      return {
        success: true,
        admin: data.admin,
        message: data.message,
      };
    } catch (error) {
      console.error("Admin login failed:", error);

      return {
        success: false,
        message: "Unable to connect to the server.",
      };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("The server could not complete logout.");
      }
    } catch (error) {
      console.error("Admin logout failed:", error);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: Boolean(admin),
        isAdminLoggedIn: Boolean(admin),
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider."
    );
  }

  return context;
};
