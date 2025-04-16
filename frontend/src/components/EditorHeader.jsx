import React from 'react';
import { Save, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const EditorHeader = ({ 
  title, 
  setTitle, 
  autoSave, 
  setAutoSave, 
  onSave, 
  saving, 
  lastSaved, 
  saveError, 
  saveMessage 
}) => {
  return (
    <div className="bg-[#1E293B] text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Title Input */}
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-none text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
              placeholder="Untitled Document"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-6">
            {/* Auto-save Toggle */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span>Auto-save</span>
            </label>

            {/* Save Status */}
            <div className="flex items-center space-x-2 text-sm">
              {/* Save Status */}
              {saving ? (
                <div className="flex items-center text-gray-300">
                  <Clock className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </div>
              ) : saveError ? (
                <div className="flex items-center text-red-400">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Save failed
                </div>
              ) : lastSaved ? (
                <div className="flex items-center text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {`Saved at ${lastSaved.toLocaleTimeString()}`}
                </div>
              ) : null}
              {saveMessage && (
                <span className="text-sm text-gray-300">{saveMessage}</span>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors duration-150"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader; 