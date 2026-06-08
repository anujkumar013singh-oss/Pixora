import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Download, FileText, Image as ImageIcon, Calendar, 
  Tag as TagIcon, Loader2, AlertCircle, ExternalLink, Cloud
} from 'lucide-react';
import axios from 'axios';

const PublicFile = () => {
  const { shortId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/f/${shortId}/info`);
        setFile(response.data);
      } catch (err) {
        setError(err.response?.status === 410 ? 'Link Expired' : 'File Not Found');
      } finally {
        setLoading(false);
      }
    };
    fetchFileInfo();
  }, [shortId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">{error}</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          {error === 'Link Expired' 
            ? 'The sharing period for this file has ended.' 
            : 'The file you are looking for does not exist or has been removed.'}
        </p>
        <Link to="/" className="text-accent hover:underline font-bold">
          Go back to Pixora
        </Link>
      </div>
    );
  }

  const isImage = file.mimeType.startsWith('image/');
  const streamUrl = `http://localhost:5001/f/${shortId}`;

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Brand Header */}
        <div className="flex justify-center mb-12">
          <Link to="/" className="flex items-center gap-2 group">
            <Cloud className="w-8 h-8 text-accent group-hover:animate-pulse" />
            <span className="text-3xl font-display font-bold electric-text-glow text-white">Pixora</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center relative">
              {isImage ? (
                <img 
                  src={streamUrl} 
                  alt={file.originalName}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : (
                <iframe
                  src={streamUrl}
                  className="w-full h-[70vh]"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2 break-all">{file.originalName}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  <span>{file.mimeType}</span>
                  <span>•</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold">Uploaded on</p>
                    <p className="text-white">{new Date(file.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {file.expiresAt && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold">Expires on</p>
                      <p className="text-white">{new Date(file.expiresAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {file.tags && file.tags.length > 0 && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <TagIcon className="w-5 h-5" />
                    <div className="flex flex-wrap gap-2">
                      {file.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-4">
                <a
                  href={streamUrl}
                  download={file.originalName}
                  className="w-full bg-accent hover:bg-accent-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all electric-glow"
                >
                  <Download className="w-5 h-5" /> Download File
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Preview link copied!');
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" /> Share Link
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Powered by <span className="text-accent font-bold">Pixora</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicFile;
