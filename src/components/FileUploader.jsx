import React, { useState, useRef, useEffect } from 'react';

const FileUploader = ({ onFileSelect, isUploading, disabled }) => {
  const [mode, setMode] = useState('upload'); // 'upload' | 'camera'
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    stopCamera();
    setPreviewUrl(null);
    setSelectedFileName('');
    setCameraError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileSelect(null);
    setMode(newMode);
  };

  const processFile = (file) => {
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      alert('Unsupported format. Please upload an image (JPG, PNG, etc.). PDF support is coming soon.');
      return;
    }

    if (file.size > MAX_SIZE) {
      alert('File exceeds the 10MB limit. Please compress or resize it before uploading.');
      return;
    }

    setSelectedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    onFileSelect(file);
  };

  // --- Upload mode handlers ---
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  };
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };
  const handleUploadZoneClick = () => {
    if (!disabled && !isUploading) fileInputRef.current?.click();
  };
  const handleClear = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setSelectedFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileSelect(null);
  };

  // Attach stream to video element after React renders it
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive]);

  // --- Camera mode handlers ---
  const startCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraActive(true); // render video element first, then useEffect attaches stream
    } catch {
      setCameraError('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Fallback dimensions if video hasn't loaded metadata yet
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(video, 0, 0, w, h);

    canvas.toBlob((blob) => {
      if (!blob) return;

      if (blob.size > MAX_SIZE) {
        alert('The captured photo exceeds 10MB. Try moving closer or using a lower-resolution camera mode.');
        return;
      }

      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setSelectedFileName(file.name);
      stopCamera();
      onFileSelect(file);
    }, 'image/jpeg', 0.92);
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setSelectedFileName('');
    onFileSelect(null);
    startCamera();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm">
        <button
          type="button"
          onClick={() => switchMode('upload')}
          disabled={disabled || isUploading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            mode === 'upload'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload File
        </button>
        <div className="w-px bg-gray-200" />
        <button
          type="button"
          onClick={() => switchMode('camera')}
          disabled={disabled || isUploading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            mode === 'camera'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Take Photo
        </button>
      </div>

      {/* Content Area */}
      {mode === 'upload' ? (
        /* ── Upload Zone ── */
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-10 transition-all duration-200 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
            previewUrl ? 'bg-gray-50' : 'bg-white'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={!previewUrl ? handleUploadZoneClick : undefined}
          role="button"
          tabIndex={disabled || isUploading ? -1 : 0}
          onKeyDown={(e) => e.key === 'Enter' && handleUploadZoneClick()}
          aria-label="Upload medical report"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {previewUrl ? (
            <div className="flex flex-col items-center gap-3">
              <img src={previewUrl} alt="Preview" className="max-h-64 w-auto rounded-lg shadow-md" />
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600 truncate max-w-[180px]">{selectedFileName}</p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                  aria-label="Remove file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-800">Upload Medical Report</h3>
              <p className="mt-2 text-sm text-gray-600">Drag and drop your file here, or click to browse</p>
              <p className="mt-1 text-xs text-gray-500">Image files: JPG, PNG, etc. (PDF coming soon)</p>
              <p className="mt-1 text-xs font-medium text-red-500">Maximum file size: 10MB</p>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
                <p className="mt-3 text-sm font-medium text-gray-700">Processing...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Camera Zone ── */
        <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
          {!cameraActive && !previewUrl ? (
            /* Start Camera */
            <div className="p-8 sm:p-10 text-center">
              <svg className="mx-auto h-14 w-14 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Take a Photo</h3>
              <p className="mt-2 text-sm text-gray-600">Use your laptop or phone camera to capture the report</p>
              <p className="mt-1 text-xs font-medium text-red-500">Captured photo must not exceed 10MB</p>

              {cameraError && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{cameraError}</p>
              )}

              <button
                type="button"
                onClick={startCamera}
                disabled={disabled || isUploading}
                className="mt-6 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Open Camera
              </button>
            </div>
          ) : cameraActive ? (
            /* Live Camera Feed */
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-72 object-cover bg-black"
              />
              <div className="p-4 flex items-center justify-center gap-4 bg-gray-900">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg shadow transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="4" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  Capture
                </button>
              </div>
            </div>
          ) : (
            /* Captured Photo Preview */
            <div className="relative p-4">
              <img src={previewUrl} alt="Captured photo" className="max-h-64 mx-auto rounded-lg shadow-md" />
              <p className="mt-2 text-center text-sm text-gray-500">Photo captured successfully</p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  disabled={disabled || isUploading}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      <p className="mt-3 text-xs text-center text-gray-500">
        Upload a clear, high-quality scan of the medical report
      </p>
    </div>
  );
};

export default FileUploader;
