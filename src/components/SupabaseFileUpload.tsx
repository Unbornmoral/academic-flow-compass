
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Trash2, File } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";

interface SupabaseFileUploadProps {
  courseId: string;
  category: 'NOTES' | 'ASSIGNMENTS/PROJECTS' | 'PAST QUESTIONS';
  readOnly?: boolean;
}

const SupabaseFileUpload: React.FC<SupabaseFileUploadProps> = ({ 
  courseId, 
  category, 
  readOnly = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { files, uploadFile, downloadFile, deleteFile } = useSupabaseData();

  const courseFiles = files.filter(f => f.course_id === courseId && f.category === category);

  const handleFileUpload = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles || readOnly) return;

    setUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        await uploadFile(file, courseId, category);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [courseId, category, readOnly, uploadFile]);

  const handleDownload = async (fileId: string) => {
    try {
      await downloadFile(fileId);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (readOnly) return;
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteFile(fileId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
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
            {uploading ? 'Uploading...' : 'Drag and drop files here, or click to select files'}
          </p>
          <Input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id={`file-upload-${courseId}-${category}`}
            disabled={uploading}
          />
          <Button variant="outline" asChild disabled={uploading}>
            <label htmlFor={`file-upload-${courseId}-${category}`} className="cursor-pointer">
              Select Files
            </label>
          </Button>
        </div>
      )}

      {courseFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            {readOnly ? 'Available Files:' : 'Uploaded Files:'}
          </h4>
          {courseFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{file.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)} • Downloads: {file.download_count} • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(file.id)}
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

      {readOnly && courseFiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <File className="mx-auto h-8 w-8 mb-2" />
          <p className="text-sm">No files available yet</p>
        </div>
      )}
    </div>
  );
};

export default SupabaseFileUpload;
