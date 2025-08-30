import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useBlogStore } from '../stores/blog';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, blogs } = useBlogStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-md md:w-[450px] w-[350px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search blogs..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-black"
        />
        {localQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
};