import React from 'react';
import { Filter, SortAsc, SortDesc } from "lucide-react";

const DocumentControls = ({ 
  sortOrder, 
  setSortOrder, 
  filter, 
  setFilter,
  user 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Documents</option>
            <option value="owned">My Documents</option>
            <option value="shared">Shared with Me</option>
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="h-5 w-5" />
          ) : (
            <SortDesc className="h-5 w-5" />
          )}
          <span>Sort by Date</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentControls; 