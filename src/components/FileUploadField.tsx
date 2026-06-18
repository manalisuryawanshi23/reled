import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, FileText, Loader } from 'lucide-react';

interface FileUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  accept?: string;
}

const API_BASE = ''; // Now handled by Vite proxy in dev, and relative in prod

export function FileUploadField({ value, onChange, label = 'File', placeholder = 'https://...', accept = '.pdf' }: FileUploadFieldProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = () => localStorage.getItem('ledprisha_auth_token') || localStorage.getItem('reled_auth_token') || '';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Network error during upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const clearFile = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="input-label">{label}</label>}

      {/* Tabs */}
      <div className="flex border border-slate-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
            tab === 'upload' ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
            tab === 'url' ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Paste URL
        </button>
      </div>

      {/* Main Area */}
      <div className="border-2 border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden">
        {value ? (
          <div className="flex items-center p-4 bg-white">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary-500" />
            </div>
            <div className="ml-4 flex-1 truncate">
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:underline truncate block">
                {value.split('/').pop()}
              </a>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="ml-2 p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4">
            {tab === 'upload' ? (
              <div 
                className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:bg-slate-50 hover:border-primary-400 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center text-primary-500">
                    <Loader className="w-6 h-6 animate-spin mb-2" />
                    <span className="text-xs font-medium">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
                    <p className="text-xs text-slate-400 mt-1">Accepts {accept}</p>
                    {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept={accept}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={placeholder}
                  className="input-field flex-1 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlApply())}
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="btn-secondary px-4 text-sm"
                  disabled={!urlInput.trim()}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
