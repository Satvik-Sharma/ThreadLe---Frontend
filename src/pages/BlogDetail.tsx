// src/pages/BlogDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Calendar,
  User,
  Send,
  ArrowLeft,
} from "lucide-react";
import { useBlogStore } from "../stores/blog";
import { useAuthStore } from "../stores/auth";
import { LoadingSpinner } from "../components/LoadingSpinner";
import MDEditor from "@uiw/react-md-editor/nohighlight";
import axios from "axios";

interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  status: "pending" | "published" | "rejected";
  likes: number;
  comments: Comment[];
}

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { blogs, likeBlog, addComment } = useBlogStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(blogs);
  // Load blog from store or fetch by ID
  useEffect(() => {
    const fetchBlogWithId = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`;
        const { data } = await axios.get(url, {
          withCredentials: true,
        });
        if (data.success) {
          setBlog(data.blog);
        }
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogWithId();
  }, [id, blogs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await likeBlog(blog!._id);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmittingComment(true);
    await addComment(blog?._id, comment.trim());
    setComment("");
    setIsSubmittingComment(false);
  };
  // Restrict viewing unpublished blogs unless author
  if ((blog?.status !== "published" && (!user || user?._id !== blog?.authorId) && !user?.isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">This blog is not available</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Blog not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Blog Content */}
        <article className="rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {blog.status !== "published" && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${blog.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                >
                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <MDEditor.Markdown
              source={blog.content}
              style={{
                whiteSpace: "pre-wrap",
                background: "transparent",
                color: "black",
              }}
            />
          </div>

          {/* Actions */}
          {blog.status === "published" && (
            <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200 group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                    fill={blog?.likes?.includes(user?._id) ? 'red' : 'none'}
                    stroke='red' />
                  <span>{blog.likes.length} likes</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blog.comments.length} comments</span>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Comments Section */}
        {blog.status === "published" && (
          <div className="rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Comments ({blog?.comments?.length})
            </h3>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!comment.trim() || isSubmittingComment}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isSubmittingComment ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-blue-800">
                  <button
                    onClick={() => navigate("/login")}
                    className="font-medium hover:underline"
                  >
                    Sign in
                  </button>{" "}
                  to join the conversation
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {blog.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                blog.comments.map((c) => (
                  <div key={c._id} className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {c.author}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{c.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
