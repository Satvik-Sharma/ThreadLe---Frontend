import { create } from 'zustand'
import axios from 'axios'

export const useAuthStore = create(set => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      // ✅ Backend should set JWT in HttpOnly cookie
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      set({ user: res.data.user, isLoading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false
      })
    }
  },

  signup: async (username, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        { username, email, password },
        { withCredentials: true }
      )

      set({ user: res.data.user, isLoading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Signup failed',
        isLoading: false
      })
    }
  },

  logout: async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )
    } catch {
      // ignore errors
    }
    set({ user: null })
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true })
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        { withCredentials: true }
      )
      set({ user: res.data.user, isLoading: false })
    } catch {
      set({ user: null, isLoading: false })
    }
  },

  clearError: () => set({ error: null })
}))
