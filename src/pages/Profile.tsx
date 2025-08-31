import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, FileText, Trash2, Eye } from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import { useBlogStore } from '../stores/blog';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');
  const { user } = useAuthStore();
  const { userBlogs, isLoading, fetchUserBlogs, deleteBlog, error } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserBlogs(user._id);
  }, [user, navigate, fetchUserBlogs]);

  const handleDeleteBlog = async (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(blogId);
    }
  };

  if (!user) {
    return null;
  }

  const pendingBlogs = userBlogs.filter(blog => blog.status === 'pending');
  const publishedBlogs = userBlogs.filter(blog => blog.status === 'published');
  const rejectedBlogs = userBlogs.filter(blog => blog.status === 'rejected');

  const currentBlogs = activeTab === 'pending' ? pendingBlogs : publishedBlogs;

  return (
    <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.username}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0 text-gray-600">
                <div className="flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {user.isAdmin && (
                <div className="flex justify-center sm:justify-start mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    Administrator
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{pendingBlogs.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Pending Approval</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{publishedBlogs.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Published</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sm:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{rejectedBlogs.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">Pending </span>
                <span className="sm:hidden">Pending </span>
                ({pendingBlogs.length})
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeTab === 'published'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="hidden sm:inline">Published </span>
                <span className="sm:hidden">Published </span>
                ({publishedBlogs.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex justify-center py-8 sm:py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : currentBlogs.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">
                  No {activeTab} blogs yet
                </p>
                <p className="text-gray-400 mt-2 text-sm sm:text-base px-4">
                  {activeTab === 'pending' 
                    ? 'Create your first blog to get started!' 
                    : 'Your published blogs will appear here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {currentBlogs.map(blog => (
                  <div key={blog.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 pr-2 sm:pr-0">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 pr-2 sm:pr-0">
                          {blog.snippet}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
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
                        {blog.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View blog"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 sm:mt-6">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};