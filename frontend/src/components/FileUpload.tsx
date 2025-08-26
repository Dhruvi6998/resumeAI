import React, { useCallback, useState } from 'react';
import { Upload, File, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  title: string;
  description: string;
  files: File[];
  maxFiles?: number;
}

export function FileUpload({ 
  accept, 
  multiple = false, 
  onFilesChange, 
  title, 
  description, 
  files,
  maxFiles = multiple ? 10 : 1 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (multiple) {
        onFilesChange([...files, ...newFiles].slice(0, maxFiles));
      } else {
        onFilesChange(newFiles.slice(0, 1));
      }
    }
  }, [files, multiple, onFilesChange, maxFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      if (multiple) {
        onFilesChange([...files, ...newFiles].slice(0, maxFiles));
      } else {
        onFilesChange(newFiles.slice(0, 1));
      }
    }
  }, [files, multiple, onFilesChange, maxFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer group",
          dragActive 
            ? "border-primary bg-primary/5 shadow-soft" 
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          "bg-gradient-card shadow-soft hover:shadow-medium"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${title}`)?.click()}
      >
        <input
          id={`file-input-${title}`}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-3">
          <div className={cn(
            "mx-auto w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            dragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
          )}>
            <Upload className="w-6 h-6" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept.toUpperCase()} files only {multiple && `• Up to ${maxFiles} files`}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-soft animate-slide-up"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-success/10 flex items-center justify-center">
                    <File className="w-4 h-4 text-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <Check className="w-3 h-3 text-success-foreground" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="w-5 h-5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}