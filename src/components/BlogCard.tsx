import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, User } from 'lucide-react';
import { Blog } from '../types';
import { useBlogStore } from '../stores/blog';
import { useAuthStore } from '../stores/auth'

interface BlogCardProps {
  blog: Blog;
  showActions?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, showActions = true }) => {
  const { likeBlog } = useBlogStore();
  const { user } = useAuthStore();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await likeBlog(blog._id);
  };

  const getStatusBadge = () => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      published: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[blog.status]}`}>
        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
      </span>
    );
  };


  return (
    <Link to={`/blog/${blog._id}`} className="block blog-card group relative">
      <div className="w-[80px] h-[80px] absolute -right-8 -top-6">
        <img src="/pin.png"/>
      </div>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {blog.title}
            </h3>
            {showActions && getStatusBadge()}
          </div>

          {/* Content */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {blog.snippet}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && blog.status === 'published' && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200 group/like"
                >
                  <Heart 
                  className="w-4 h-4 group-hover/like:scale-110 transition-transform duration-200" 
                  fill={blog?.likes?.includes(user?._id) ? 'red' : 'none'}
                  stroke='red'
                  />
                  <span className="text-sm">{blog?.likes?.length}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{blog.comments.length}</span>
                </div>
              </div>
              
              <span className="text-xs text-gray-400">
                {Math.ceil(blog.content.length / 1000)} min read
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};