import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeUploader = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
    } else {
      toast.error('Please upload a PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      toast.success('Resume uploaded and analyzed successfully!');
      onUploadComplete(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">Upload Your Resume</h2>
      <p className="text-gray-300 mb-6">
        Upload your resume in PDF format for AI-powered analysis and improvement suggestions
      </p>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-white/20 bg-white/5 hover:border-indigo-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-white">Drop your resume here...</p>
        ) : (
          <>
            <p className="text-white mb-2">Drag & drop your resume here</p>
            <p className="text-gray-400 text-sm">or click to browse</p>
            <p className="text-gray-500 text-xs mt-2">PDF only (max 5MB)</p>
          </>
        )}
      </div>
      
      {file && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white">{file.name}</p>
                <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button
              onClick={handleUpload}
              isLoading={uploading}
              variant="primary"
              size="sm"
            >
              Upload & Analyze
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumeUploader;