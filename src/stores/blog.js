import { create } from 'zustand'
import axios from 'axios'

// Axios instance (adjust baseURL to your backend)
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // change if needed
  withCredentials: true // allow cookies (JWT in cookies)
})

export const useBlogStore = create((set, get) => ({
  blogs: [],
  userBlogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get('/api/blogs')
      set({ blogs: data.blogs, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch blogs', isLoading: false })
    }
  },

  // Fetch blogs for a specific user
  fetchUserBlogs: async userId => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/api/blogs/user/${userId}`)
      set({ userBlogs: data.blogs, isLoading: false })
      console.log(data.blogs);
    } catch (error) {
      set({ error: 'Failed to fetch user blogs', isLoading: false })
    }
  },

  // Create a new blog
  createBlog: async (title, content) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post('/api/blogs/create', { title, content })
      set(state => ({
        blogs: [...state.blogs, data],
        userBlogs: [...state.userBlogs, data],
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Failed to create blog', isLoading: false })
    }
  },

  // Like a blog
  likeBlog: async (blogId) => {
    try {
      const { data } = await api.post(`/api/blogs/${blogId}/like`)
      set(state => ({
        blogs: state.blogs.map(blog =>
          blog._id === blogId ? { ...blog, likes: data.likes } : blog
        )
      }))
    } catch (error) {
      set({ error: 'Failed to like blog' })
    }
  },

  // Add a comment
  addComment: async (blogId, content) => {
    try {
      const { data } = await api.post(`/api/blogs/${blogId}/comments`, { content })
      console.log(data.comment);
      set(state => ({
        blogs: state.blogs.map(blog =>
          blog._id === blogId
            ? { ...blog, comments: [...blog.comments, data.comment] }
            : blog
        )
      }))
    } catch (error) {
      set({ error: 'Failed to add comment' })
    }
  },

  // Delete a blog
  deleteBlog: async blogId => {
    try {
      await api.delete(`/api/blogs/${blogId}`)
      set(state => ({
        blogs: state.blogs.filter(blog => blog._id !== blogId),
        userBlogs: state.userBlogs.filter(blog => blog._id !== blogId)
      }))
    } catch (error) {
      set({ error: 'Failed to delete blog' })
    }
  },

  // Approve blog (for admin)
  approveBlog: async blogId => {
    try {
      const { data } = await api.patch(`/api/blogs/${blogId}/approve`)
      set(state => ({
        blogs: state.blogs.map(blog => (blog._id === blogId ? data.blog : blog))
      }))
    } catch (error) {
      set({ error: 'Failed to approve blog' })
    }
  },

  // Reject blog (for admin)
  rejectBlog: async blogId => {
    try {
      const { data } = await api.patch(`/api/blogs/${blogId}/reject`)
      set(state => ({
        blogs: state.blogs.map(blog =>
          blog._id === blogId ? { ...blog, status: data.status } : blog
        )
      }))
    } catch (error) {
      set({ error: 'Failed to reject blog' })
    }
  },

  setSearchQuery: query => set({ searchQuery: query }),
  clearError: () => set({ error: null })
}))
