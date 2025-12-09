// components/FileUploadDropzone.tsx
import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
  title?: string;
  description?: string;
  helperText?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFilesSelected,
  title = 'Click to upload files',
  description = 'or drag and drop',
  helperText = 'PDF, Word, Excel, Images up to 20MB',
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // ให้เลือกไฟล์เดิมซ้ำได้
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-2xl px-6 py-8 bg-gray-50 hover:bg-blue-50/40 hover:border-blue-300 transition-colors cursor-pointer group text-center"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleChange}
      />

      <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-blue-100 flex items-center justify-center text-gray-500 group-hover:text-blue-600 mx-auto mb-4 transition-colors">
        <UploadCloud size={24} />
      </div>

      <p className="text-base font-bold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <p className="text-xs text-gray-400 mt-3 bg-white px-3 py-1 inline-flex rounded-full">
        {helperText}
      </p>
    </div>
  );
};
