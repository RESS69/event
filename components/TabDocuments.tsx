
import React from 'react';
import { FileText, Image, Download, Paperclip, File } from 'lucide-react';
import { EventItem, EventDocument } from '../types';

interface TabDocumentsProps {
  event: EventItem;
}

const InfoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export const TabDocuments: React.FC<TabDocumentsProps> = ({ event }) => {
  const getIcon = (type: EventDocument['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'image': return <Image className="w-6 h-6 text-blue-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <Paperclip className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Attached Documents</h3>
        </div>

        {event.documents.length === 0 ? (
           <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
             <p className="text-gray-400">No documents attached to this event.</p>
           </div>
        ) : (
          <div className="flex flex-col gap-4">
            {event.documents.map((doc, idx) => (
              <div key={doc.id || idx} className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    {getIcon(doc.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.size}</p>
                  </div>
                </div>
                
                <a 
                  href={doc.url || '#'} 
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Read Only Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
         <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
         <div>
           <h5 className="text-sm font-bold text-blue-800">File Requirements</h5>
           <p className="text-xs text-blue-600 mt-1">Supported formats: PDF, JPG, PNG. Maximum file size: 10MB per file.</p>
         </div>
      </div>
    </div>
  );
};
