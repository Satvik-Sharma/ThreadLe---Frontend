import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, User, LogOut, PenTool, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/auth';

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useGSAP(() => {
    gsap.timeline().from('nav', {
      y: -100,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1
    }).from('.logo', {
      x: -50,
      opacity: 0,
      duration: 0.5
    })
  })

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl logo font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ThreadLe
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className='icon'>Home</span>
            </Link>
            
            <Link
              to="/trending"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/trending') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className='icon'>Trending</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/create-blog"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/create-blog') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span className='icon'>Write</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/profile') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className='icon'>Profile</span>
                </Link>

                {user.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/admin/dashboard') 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className='icon'>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block font-bold">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden icon sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            <Link
              to="/"
              className={`flex flex-col items-center py-2 px-3 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            <Link
              to="/trending"
              className={`flex flex-col items-center py-2 px-3 ${
                isActive('/trending') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs mt-1">Trending</span>
            </Link>

            <Link
              to="/create-blog"
              className={`flex flex-col items-center py-2 px-3 ${
                isActive('/create-blog') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span className="text-xs mt-1">Write</span>
            </Link>

            <Link
              to="/profile"
              className={`flex flex-col items-center py-2 px-3 ${
                isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Profile</span>
            </Link>

            {user.isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive('/admin/dashboard') ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};