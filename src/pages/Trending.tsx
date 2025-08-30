import React, { useEffect } from 'react';
import { TrendingUp, Flame, Award } from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBlogStore } from '../stores/blog';

export const Trending: React.FC = () => {
  const { blogs, isLoading, error, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  
  // Sort by engagement (likes + comments)
  const trendingBlogs = publishedBlogs
    .sort((a, b) => {
      const aEngagement = a.likes.length + a.comments.length;
      const bEngagement = b.likes.length + b.comments.length;
      return bEngagement - aEngagement;
    });

  const topBlogs = trendingBlogs.slice(0, 3);
  const otherTrendingBlogs = trendingBlogs.slice(3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Trending Stories</h1>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular and engaging content on BlogNova
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {trendingBlogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No trending blogs yet</p>
            <p className="text-gray-400 mt-2">Check back later for popular content!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Trending */}
            {topBlogs.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center space-x-2 mb-6">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Top Trending</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {topBlogs.map((blog, index) => (
                    <div key={blog.id} className="relative">
                      {/* Ranking Badge */}
                      <div className="absolute -top-2 -left-2 z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Other Trending Blogs */}
            {otherTrendingBlogs.length > 0 && (
              <section>
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-900">More Trending</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherTrendingBlogs.map(blog => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};