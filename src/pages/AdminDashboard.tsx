import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2,
  Clock,
  TrendingUp,
  Users,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import { useBlogStore } from '../stores/blog';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const { blogs, isLoading, fetchBlogs, approveBlog, rejectBlog, deleteBlog } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchBlogs();
  }, [user, navigate, fetchBlogs]);

  const handleApproveBlog = async (blogId: string) => {
    await approveBlog(blogId);
  };

  const handleRejectBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to reject this blog?')) {
      await rejectBlog(blogId);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      await deleteBlog(blogId);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  if (!user || !user.isAdmin) {
    return null;
  }

  const pendingBlogs = blogs.filter(blog => blog.status === 'pending');
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const rejectedBlogs = blogs.filter(blog => blog.status === 'rejected');

  const currentBlogs = activeTab === 'pending' ? pendingBlogs : publishedBlogs;
  const totalLikes = publishedBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
  const totalComments = publishedBlogs.reduce((sum, blog) => sum + blog.comments.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex relative">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 px-4 py-3 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative lg:translate-x-0 z-40
          w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:block
        `}>
          <div className="p-6 pt-20 lg:pt-6">
            <div className="hidden lg:flex items-center space-x-3 mb-8">
              <Settings className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  closeSidebar();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Pending Blogs</span>
                {pendingBlogs.length > 0 && (
                  <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {pendingBlogs.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('published');
                  closeSidebar();
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'published'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Published Blogs</span>
                <span className="ml-auto text-xs text-gray-500">
                  {publishedBlogs.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 pt-20 lg:p-8 lg:pt-8 lg:ml-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{pendingBlogs.length}</p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">Pending Review</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{publishedBlogs.length}</p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">Published</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{totalLikes}</p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">Total Likes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg lg:text-2xl font-bold text-gray-900">{totalComments}</p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">Total Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Tab Header */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 py-3 lg:py-4 px-3 lg:px-6 text-xs lg:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'pending'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Pending Blogs </span>
                  <span className="sm:hidden">Pending </span>
                  ({pendingBlogs.length})
                </button>
                <button
                  onClick={() => setActiveTab('published')}
                  className={`flex-1 py-3 lg:py-4 px-3 lg:px-6 text-xs lg:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'published'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Published Blogs </span>
                  <span className="sm:hidden">Published </span>
                  ({publishedBlogs.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 lg:p-6">
              {isLoading ? (
                <div className="flex justify-center py-8 lg:py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : currentBlogs.length === 0 ? (
                <div className="text-center py-8 lg:py-12">
                  <FileText className="w-10 h-10 lg:w-12 lg:h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base lg:text-lg">
                    No {activeTab} blogs
                  </p>
                  <p className="text-gray-400 mt-2 text-sm lg:text-base">
                    {activeTab === 'pending' 
                      ? 'All caught up! No blogs waiting for review.' 
                      : 'No blogs have been published yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  {currentBlogs.map(blog => (
                    <div key={blog._id} className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {blog.snippet}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-500">
                            <span className="truncate max-w-32 sm:max-w-none">By: {blog.author}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                            {blog.status === 'published' && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span>{blog.likes} likes</span>
                                <span className="hidden sm:inline">•</span>
                                <span>{blog.comments.length} comments</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-2 mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                          <button
                            onClick={() => navigate(`/blog/${blog._id}`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View blog"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {activeTab === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApproveBlog(blog._id)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                title="Approve blog"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectBlog(blog._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Reject blog"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete blog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};