import React, { useState, useRef } from 'react';

/**
 * FileUploader Component
 * Handles file upload with drag-and-drop and click-to-upload
 * Cross-browser compatible with touch support
 */
const FileUploader = ({ onFileSelect, isUploading, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Supported file types
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const acceptedExtensions = '.jpg,.jpeg,.png,.pdf';

  /**
   * Handle file selection and validation
   */
  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG) or PDF');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // PDF preview not shown
    }

    // Pass file to parent component
    onFileSelect(file);
  };

  /**
   * Handle drag enter event
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  /**
   * Handle click to open file browser
   */
  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  /**
   * Clear selected file
   */
  const handleClear = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg 
          p-6 sm:p-8 md:p-10 lg:p-12
          transition-all duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          }
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${previewUrl ? 'bg-gray-50' : 'bg-white'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled || isUploading ? -1 : 0}
        aria-label="Upload medical report"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedExtensions}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || isUploading}
          aria-label="File input"
        />

        {/* Preview or Upload UI */}
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
              aria-label="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            {/* Upload Icon */}
            <svg
              className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {/* Upload Text */}
            <h3 className="mt-4 text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Upload Medical Report
            </h3>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-600">
              Drag and drop your file here, or click to browse
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Supported formats: JPG, PNG, PDF (max 10MB)
            </p>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-3 text-sm font-medium text-gray-700">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="mt-3 text-xs sm:text-sm text-center text-gray-500">
        Upload a clear, high-quality scan of the medical report
      </p>
    </div>
  );
};

export default FileUploader;
