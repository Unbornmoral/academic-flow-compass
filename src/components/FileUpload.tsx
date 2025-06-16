
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Trash2, File } from "lucide-react";
import { UploadedFile } from "@/data/sessions";

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  itemType: string;
  readOnly?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange, itemType, readOnly = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || readOnly) return;

    Array.from(selectedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string,
          uploadDate: new Date().toISOString()
        };
        onFilesChange([...files, newFile]);
      };
      reader.readAsDataURL(file);
    });
  }, [files, onFilesChange, readOnly]);

  const handleDownload = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (fileId: string) => {
    if (readOnly) return;
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!readOnly) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!readOnly) handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop files here, or click to select files
          </p>
          <Input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id={`file-upload-${itemType}`}
          />
          <Button variant="outline" asChild>
            <label htmlFor={`file-upload-${itemType}`} className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            {readOnly ? 'Available Files:' : 'Uploaded Files:'}
          </h4>
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(file)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(file.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {readOnly && files.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <File className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm">No files available yet</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
