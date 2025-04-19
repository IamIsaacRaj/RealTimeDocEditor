import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Share2 } from 'lucide-react';

const DocumentGrid = ({ documents, user }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <div
          key={doc._id}
          onClick={() => navigate(`/document/${doc._id}/${user?.id || 'guest'}`)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer p-4"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
            {doc.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{doc.creator?.username || 'Unknown'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {doc.lastEditor && doc.lastEditor !== doc.creator && (
                <span>Last edited by {doc.lastEditor?.username || 'Unknown'}</span>
              )}
            </div>
            {doc.isShared && (
              <div className="flex items-center text-blue-500">
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-sm">Shared</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid; 