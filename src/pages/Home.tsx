import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Clock, Sparkles, ArrowDown } from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useBlogStore } from '../stores/blog';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export const Home: React.FC = () => {
  const { blogs, isLoading, error, searchQuery, fetchBlogs } = useBlogStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Custom typing animation
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const words = ['Threads', 'Insights', 'Trends', 'Vibes', 'Stories', 'Ideas'];
  
  useEffect(() => {
    const word = words[currentWordIndex];
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      if (currentText.length < word.length) {
        timeout = setTimeout(() => {
          setCurrentText(word.slice(0, currentText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [currentText, isTyping, currentWordIndex]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const publishedBlogs = blogs.filter(blog => blog.status === 'published');

  const filteredBlogs = searchQuery
    ? publishedBlogs.filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : publishedBlogs;

  const latestBlogs = filteredBlogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const trendingBlogs = filteredBlogs
    .sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length))
    .slice(0, 3);

  const h1Ref = useRef(null);
  useGSAP(() => {
    gsap.from(h1Ref.current, {
      y: 100,
      opacity: 0,
      duration: 0.6,
    })
  }, [h1Ref.current])

  // Smooth scroll to content
  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div ref={heroRef} className="video relative w-full h-[92vh] shadow-[#5c4b41] shadow-2xl overflow-hidden">
        {/* Background Video */}
        <video
          src="/video1.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Enhanced Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        
        {/* Animated particles overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Enhanced Text Content */}
        <div className="text absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-50">
          <h1 ref={h1Ref} className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Welcome to <span className='bg-gradient-to-r from-orange-500 to-red-200 bg-clip-text text-transparent'>ThreadLe</span>
          </h1>
          <p className="text-xl md:text-3xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Where ideas turn into{' '}
            <span className="font-semibold text-white relative">
              {currentText}
              <span className="animate-pulse ml-1 text-blue-300">|</span>
            </span>
          </p>
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>
          
          {/* Scroll Indicator */}
          <div 
            className="absolute bottom-8 cursor-pointer group"
            onClick={scrollToContent}
          >
            <div className="flex flex-col items-center text-white/80 group-hover:text-white transition-colors duration-300">
              <span className="text-sm font-light mb-2 tracking-wide">Explore Stories</span>
              <ArrowDown className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="content-section blogs-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {searchQuery && (
          <div className="mb-12">
            <h2 className="section-header text-3xl font-bold text-gray-900 mb-6">
              Search Results for "<span className="text-blue-600">{searchQuery}</span>"
            </h2>
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No blogs found matching your search.</p>
                <p className="text-gray-400 mt-2">Try different keywords or explore trending content below.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map(blog => (
                  <div key={blog._id} className="blog-card">
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Enhanced Trending Section */}
            {trendingBlogs.length > 0 && (
              <section className="trending-section mb-16">
                <div className="section-header flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Trending Now
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trendingBlogs.map(blog => (
                    <div key={blog._id} className="trending-card blog-card transform hover:scale-105 transition-all duration-300">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Enhanced Latest Blogs Section */}
            <section>
              <div className="section-header flex items-center space-x-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Latest Stories
                </h2>
              </div>

              {latestBlogs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-blue-500" />
                    </div>
                    <p className="text-gray-600 text-xl font-medium mb-2">No published blogs yet.</p>
                    <p className="text-gray-500 text-lg">Be the first to share your story!</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestBlogs.map(blog => (
                    <div key={blog._id} className="blog-card transform hover:scale-105 transition-all duration-300">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};