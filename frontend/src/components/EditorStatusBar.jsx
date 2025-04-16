import React from 'react';
import { FileText, Clock, Hash } from 'lucide-react';

const EditorStatusBar = ({ content }) => {
  const getWordCount = () => {
    if (!content) return 0;
    const text = content.ops?.map(op => typeof op.insert === 'string' ? op.insert : '').join('');
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = () => {
    if (!content) return 0;
    const text = content.ops?.map(op => typeof op.insert === 'string' ? op.insert : '').join('');
    return text.length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    const minutes = Math.ceil(words / 200); // Average reading speed of 200 words per minute
    return `${minutes} min read`;
  };

  return (
    <div className="bg-[#1E293B] text-gray-300 border-t border-gray-700 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-end space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>{getWordCount()} words</span>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4" />
          <span>{getCharacterCount()} characters</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>{getReadingTime()}</span>
        </div>
      </div>
    </div>
  );
};

export default EditorStatusBar; 