
import React, { useRef } from 'react';
import { FileText, Image, Trash2, UploadCloud, File as FileIcon } from 'lucide-react';
import { EventItem, EventDocument } from '../types';

interface TabDocumentsEditProps {
  event: EventItem;
  onChange: (event: EventItem) => void;
}

export const TabDocumentsEdit: React.FC<TabDocumentsEditProps> = ({ event, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = (type: EventDocument['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'image': return <Image className="w-6 h-6 text-blue-500" />;
      default: return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleDelete = (index: number) => {
     const newDocs = event.documents.filter((_, i) => i !== index);
     onChange({ ...event, documents: newDocs });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (files && files.length > 0) {
        // Mock file upload processing
        const newDocs: EventDocument[] = Array.from(files).map((file: File, idx) => ({
           id: `doc-new-${Date.now()}-${idx}`,
           name: file.name,
           type: file.name.endsWith('.pdf') ? 'pdf' : (file.type.includes('image') ? 'image' : 'docx'), // simple mock type detection
           size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
           url: '#'
        }));
        
        onChange({ ...event, documents: [...event.documents, ...newDocs] });
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Upload Area */}
      <div 
         onClick={() => fileInputRef.current?.click()}
         className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
      >
         <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={handleFileUpload} 
         />
         <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-blue-200 flex items-center justify-center text-gray-500 group-hover:text-blue-600 mb-4 transition-colors">
            <UploadCloud size={24} />
         </div>
         <p className="text-base font-bold text-gray-900">Click to upload files</p>
         <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
         <p className="text-xs text-gray-400 mt-3 bg-white px-2 py-1 rounded-full border border-gray-200">Support: PDF, JPG, PNG (Max 10MB)</p>
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Attached Documents ({event.documents.length})</h3>

        {event.documents.length === 0 ? (
           <div className="text-center py-8 text-gray-400 italic">
             No documents attached yet.
           </div>
        ) : (
          <div className="flex flex-col gap-3">
            {event.documents.map((doc, idx) => (
              <div key={doc.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white group">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    {getIcon(doc.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.size}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove File"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
