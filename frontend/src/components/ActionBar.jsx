import React from 'react';
import { Plus, Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import mammoth from 'mammoth';

const ActionBar = ({ setShowModal, user }) => {
  const navigate = useNavigate();

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const docId = `imported-${Date.now()}`;
    const userId = user?.id || 'guest';

    reader.onerror = () => {
      alert("Error reading file");
    };

    try {
      switch (file.name.split('.').pop().toLowerCase()) {
        case 'txt':
          reader.onload = () => {
            const content = reader.result;
            navigate(`/document/${docId}/${userId}`, {
              state: {
                title: file.name,
                content: { ops: [{ insert: content }] },
              },
            });
          };
          reader.readAsText(file);
          break;

        case 'json':
          reader.onload = () => {
            try {
              const delta = JSON.parse(reader.result);
              navigate(`/document/${docId}/${userId}`, {
                state: { 
                  title: file.name, 
                  content: delta 
                },
              });
            } catch (error) {
              alert("Invalid JSON format! The file must contain valid Quill Delta format.");
            }
          };
          reader.readAsText(file);
          break;

        case 'docx':
          reader.onload = async () => {
            try {
              const arrayBuffer = reader.result;
              const result = await mammoth.convertToHtml({ arrayBuffer });
              const delta = {
                ops: [
                  {
                    insert: result.value,
                    attributes: { renderAsHTML: true }
                  }
                ]
              };
              
              navigate(`/document/${docId}/${userId}`, {
                state: {
                  title: file.name,
                  content: delta,
                },
              });
            } catch (error) {
              console.error("Word conversion error:", error);
              alert("Error converting Word document. Please make sure it's a valid .docx file.");
            }
          };
          reader.readAsArrayBuffer(file);
          break;

        default:
          alert("Unsupported file type. Please use .txt, .json, or .docx files.");
          return;
      }
    } catch (error) {
      console.error("Error importing document:", error);
      alert("Error importing document. Please try again.");
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5" />
          <span>New Document</span>
        </button>
        
        <label className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50 transition cursor-pointer">
          <Upload className="h-5 w-5" />
          <span>Import</span>
          <input
            type="file"
            className="hidden"
            accept=".txt,.json,.docx"
            onChange={handleImport}
          />
        </label>
      </div>
    </div>
  );
};

export default ActionBar; 