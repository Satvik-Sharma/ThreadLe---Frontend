import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Send } from 'lucide-react';
import MDEditor from "@uiw/react-md-editor";
import { useBlogStore } from '../stores/blog';
import { useAuthStore } from '../stores/auth';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | undefined>(''); // works with MDEditor
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  
  const { createBlog, isLoading, error } = useBlogStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!content || !content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await createBlog(title.trim(), content!.trim());
    
    if (!error) {
      navigate('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-color-mode="light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <PenTool className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Create New Blog</h1>
          </div>
          <p className="text-gray-600">Share your thoughts and stories with the BlogNova community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter an engaging title for your blog..."
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Markdown Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content (Markdown)
            </label>
            <MDEditor
              value={content}
              onChange={setContent}
              height={400}
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Ready to publish?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your blog will be submitted for admin approval before going live.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
