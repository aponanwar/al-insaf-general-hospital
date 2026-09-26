'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Link as LinkIcon, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  folder?: string;
  defaultPlaceholder?: string;
  required?: boolean;
}

export default function ImageUploadInput({
  label = 'Profile Photo',
  imageUrl,
  onImageUrlChange,
  selectedFile,
  onFileSelect,
  folder = 'hospital/staff',
  defaultPlaceholder = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  required = false,
}: ImageUploadInputProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>(selectedFile ? 'upload' : (imageUrl && imageUrl.startsWith('http') && !imageUrl.startsWith('data:') ? 'url' : 'upload'));
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onFileSelect(null);
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please select a valid image file (JPG, PNG, WEBP, GIF)');
      setUploadStatus('error');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage('Image size must be less than 10MB');
      setUploadStatus('error');
      return;
    }

    onFileSelect(file);
    setUploadStatus('idle');
    setStatusMessage('');

    // Generate instant preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      // Also update imageUrl with the local dataUrl for instant visual preview
      onImageUrlChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUrlChange = (url: string) => {
    onImageUrlChange(url);
    setPreviewUrl(url);
    onFileSelect(null);
  };

  const handleRemoveImage = () => {
    onFileSelect(null);
    onImageUrlChange('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadStatus('idle');
    setStatusMessage('');
  };

  // Optional manual instant upload test / trigger
  const handleDirectUploadToCloudinary = async () => {
    if (!selectedFile && !imageUrl) return;
    setUploading(true);
    setUploadStatus('idle');
    setStatusMessage('Uploading to Cloudinary...');

    try {
      let payloadFile = imageUrl;
      if (selectedFile && !imageUrl.startsWith('data:')) {
        const reader = new FileReader();
        payloadFile = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedFile);
        });
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: payloadFile, folder }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onImageUrlChange(data.url);
        setPreviewUrl(data.url);
        onFileSelect(null);
        setUploadStatus('success');
        setStatusMessage('Image uploaded to Cloudinary successfully!');
      } else {
        setUploadStatus('error');
        setStatusMessage(data.error || 'Cloudinary upload failed.');
      }
    } catch (err: any) {
      setUploadStatus('error');
      setStatusMessage(err.message || 'Upload error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const displayImage = previewUrl || imageUrl || defaultPlaceholder;

  return (
    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Upload Mode Switcher */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeTab === 'url'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Main Container: Preview + Input Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Live Preview Avatar */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-sm relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultPlaceholder;
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                <span className="text-[9px] font-bold">No Photo</span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-1" />
                <span className="text-[9px] font-bold">Uploading</span>
              </div>
            )}
          </div>

          {displayImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              title="Remove Image"
              className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-transform hover:scale-110"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex-1 w-full space-y-2">
          {activeTab === 'upload' ? (
            <div>
              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {selectedFile ? (
                      <span className="text-emerald-700 font-bold truncate max-w-[200px] inline-block">
                        {selectedFile.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-emerald-600 font-bold">Click to upload</span> or drag and drop
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {selectedFile
                      ? `Size: ${(selectedFile.size / 1024).toFixed(1)} KB (Will be uploaded to Cloudinary)`
                      : 'PNG, JPG, WEBP or GIF (Auto-compressed & saved to Cloudinary)'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* External Image URL Input */}
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  value={imageUrl && !imageUrl.startsWith('data:') ? imageUrl : ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => handleUrlChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Paste a direct image link from Unsplash, Cloudinary, or any web source.
              </p>
            </div>
          )}

          {/* Status / Feedback message */}
          {statusMessage && (
            <div
              className={`text-[11px] font-medium flex items-center space-x-1.5 pt-0.5 ${
                uploadStatus === 'error'
                  ? 'text-rose-600'
                  : uploadStatus === 'success'
                  ? 'text-emerald-600'
                  : 'text-slate-500'
              }`}
            >
              {uploadStatus === 'success' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Cloudinary Tag */}
          {imageUrl && imageUrl.includes('cloudinary.com') && (
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <Check className="w-3 h-3" />
              <span>Cloudinary Hosted Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
