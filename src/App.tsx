import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CreateBlog } from './pages/CreateBlog';
import { Profile } from './pages/Profile';
import { BlogDetail } from './pages/BlogDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Trending } from './pages/Trending';
import { useEffect } from 'react';
import { useAuthStore } from './stores/auth';
function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser])
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;