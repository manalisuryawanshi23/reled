import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, ImageIcon, Loader } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

const API_BASE = ''; // Now handled by Vite proxy in dev, and relative in prod

export function ImageUploadField({ value, onChange, label = 'Image', placeholder = 'https://...' }: ImageUploadFieldProps) {
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

  const clearImage = () => {
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

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-slate-100 group-hover:bg-primary-100 rounded-xl flex items-center justify-center transition-colors">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
              </div>
              <p className="text-sm font-medium text-slate-600">Drop image here or click to browse</p>
              <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}
        </div>
      )}

      {/* URL Tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlApply()}
            placeholder={placeholder}
            className="input-field flex-1 text-sm"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block mt-1">
          <div className="w-full aspect-video max-w-xs rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '';
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{value}</p>
        </div>
      )}
    </div>
  );
}
