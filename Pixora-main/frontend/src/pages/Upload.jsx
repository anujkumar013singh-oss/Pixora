import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, File as FileIcon, X, CheckCircle, Copy, Loader2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const { refreshUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (processing && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (processing && countdown === 0) {
      setProcessing(false);
    }
    return () => clearInterval(timer);
  }, [processing, countdown]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
      setResult(null);
      setCountdown(5);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/files/upload', formData);
      setUploading(false);
      setProcessing(true); // Start the 5-second countdown
      setResult(data);
      setFile(null);
      // Refresh user data to update storage usage
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.publicUrl) {
      navigator.clipboard.writeText(result.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetState = () => {
    setFile(null);
    setResult(null);
    setProcessing(false);
    setCountdown(5);
    setError('');
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {!result && !uploading && !processing ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter mb-4">Upload Asset</h1>
                <p className="text-muted font-body uppercase tracking-widest text-sm">JPEG · PNG · PDF</p>
              </div>

              <div
                {...getRootProps()}
                className={`
                  relative border-[1px] border-dashed transition-all duration-500 py-24 px-10 text-center cursor-pointer btn-sharp
                  ${isDragActive ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-accent/40 bg-surface-1'}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-accent/10 flex items-center justify-center btn-sharp text-accent group-hover:scale-110 transition-transform">
                    <UploadIcon size={32} />
                  </div>
                  {file ? (
                    <div className="space-y-2">
                      <p className="text-2xl font-display font-bold text-white uppercase tracking-tight">{file.name}</p>
                      <p className="text-sm text-muted font-body uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                        {isDragActive ? 'Drop it here' : 'Drop your file here'}
                      </p>
                      <p className="text-sm text-muted font-body uppercase tracking-widest">or click to browse local storage</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 btn-sharp flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {file && (
                <button
                  onClick={handleUpload}
                  className="w-full bg-accent hover:bg-accent-dark text-white py-6 btn-sharp font-extrabold text-lg uppercase tracking-[0.3em] transition-all duration-500 electric-glow-strong"
                >
                  Convert to Universal Link
                </button>
              )}
            </motion.div>
          ) : uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 border-t-2 border-accent rounded-full animate-spin mx-auto mb-10" />
              <h2 className="text-4xl font-display font-bold uppercase tracking-tighter mb-4">Uploading</h2>
              <p className="text-muted font-body uppercase tracking-widest text-sm">Securing your asset in the cloud...</p>
            </motion.div>
          ) : processing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center py-20 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-96 h-96 bg-accent rounded-full blur-[100px]"
                />
              </div>
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-[240px] font-display font-black leading-none text-white mb-10"
              >
                {countdown}
              </motion.div>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tighter mb-4">Generating Universal Link</h2>
              <p className="text-muted font-body uppercase tracking-widest text-sm">Optimizing for global accessibility</p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-accent/20 text-accent flex items-center justify-center btn-sharp mx-auto mb-8 electric-glow">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4">Link Ready</h2>
                <p className="text-muted font-body uppercase tracking-widest text-sm italic">Asset successfully converted to universal format</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    readOnly
                    value={result?.publicUrl}
                    className="w-full bg-surface-2 border border-white/10 btn-sharp py-6 px-8 text-accent font-display font-bold text-lg outline-none tracking-tight"
                  />
                  <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/30 transition-colors pointer-events-none btn-sharp" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center gap-3 py-5 btn-sharp font-bold uppercase tracking-widest transition-all duration-300 ${
                      copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    <Copy size={20} />
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={result?.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-surface-2 border border-white/10 hover:border-accent text-white py-5 btn-sharp font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    <ExternalLink size={20} />
                    Open Link
                  </a>
                </div>
                
                <button
                  onClick={resetState}
                  className="w-full border border-white/5 hover:border-white/20 text-muted hover:text-white py-4 btn-sharp font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Upload Another Asset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upload;
