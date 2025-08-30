export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  status: 'pending' | 'published' | 'rejected';
  likes: [string];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  snippet: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface BlogState {
  blogs: Blog[];
  userBlogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  fetchBlogs: () => Promise<void>;
  fetchUserBlogs: (userId: string) => Promise<void>;
  createBlog: (title: string, content: string) => Promise<void>;
  likeBlog: (blogId: string) => Promise<void>;
  addComment: (blogId: string, content: string) => Promise<void>;
  deleteBlog: (blogId: string) => Promise<void>;
  approveBlog: (blogId: string) => Promise<void>;
  rejectBlog: (blogId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}