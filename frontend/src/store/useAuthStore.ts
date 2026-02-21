import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_image?: string;
  bio?: string;
  about?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

// Ensure the base URL matches your backend environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useAuthStore = create<AuthState>()((set) => {
  let initialUser = null;
  try {
    const userCookie = Cookies.get("user");
    if (userCookie && userCookie !== "undefined") {
      initialUser = JSON.parse(userCookie);
    }
  } catch (error) {
    console.error("Failed to parse user cookie", error);
  }

  return {
    user: initialUser,
    token: Cookies.get("token") || null,
    isAuthenticated: !!Cookies.get("token"),
    isLoading: false,
    error: null,

    login: async (credentials: Record<string, string>) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        const { token, user } = response.data.data;
        Cookies.set("token", token, { expires: 7 }); // Expires in 7 days
        if (user) Cookies.set("user", JSON.stringify(user), { expires: 7 });

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Login failed",
          isLoading: false,
        });
        throw error;
      }
    },

    register: async (userData: Record<string, any>) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        const { token, user } = response.data.data;
        Cookies.set("token", token, { expires: 7 });
        if (user) Cookies.set("user", JSON.stringify(user), { expires: 7 });

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Registration failed",
          isLoading: false,
        });
        throw error;
      }
    },

    logout: () => {
      Cookies.remove("token");
      Cookies.remove("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    checkAuth: () => {
      const token = Cookies.get("token");
      const userStr = Cookies.get("user");

      let parsedUser = null;
      try {
        if (userStr && userStr !== "undefined") {
          parsedUser = JSON.parse(userStr);
        }
      } catch (e) {
        console.error("Failed to parse user in checkAuth", e);
      }

      if (token) {
        set({
          token,
          isAuthenticated: true,
          user: parsedUser,
        });
      } else {
        set({
          token: null,
          isAuthenticated: false,
          user: null,
        });
      }
    },
  };
});
