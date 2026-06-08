import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Trash2, Copy, ExternalLink, 
  FileText, Image as ImageIcon, Loader2, AlertCircle, Plus,
  LayoutGrid, List, HardDrive, Download, Eye, Calendar, User, LogOut, Settings, Cloud
} from 'lucide-react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchFiles();
    refreshUser(); // Refresh user data when dashboard loads
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await api.get('/files');
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch files', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles(files.filter(f => f._id !== id));
      setDeleteConfirm(null);
      // Refresh user data to update storage
      await refreshUser();
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    // Simple alert for feedback
    alert('Universal link copied to clipboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredFiles = files.filter(file => 
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const storageLimit = 100 * 1024 * 1024; // 100MB
  const storageUsed = user?.storageUsed || 0;
  const storagePercent = Math.min((storageUsed / storageLimit) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-muted font-display uppercase tracking-widest text-xs font-bold">Synchronizing Assets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-surface-1 border-r border-white/5 p-8 flex flex-col justify-between">
        <div className="space-y-12">
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter block">Pixora</Link>
          
          <nav className="flex flex-col gap-4">
            <Link to="/dashboard" className="flex items-center gap-4 text-accent font-bold uppercase tracking-widest text-xs p-4 bg-accent/5 btn-sharp border border-accent/20">
              <LayoutGrid size={16} /> Dashboard
            </Link>
            <Link to="/upload" className="flex items-center gap-4 text-muted hover:text-white transition-all uppercase tracking-widest text-xs p-4 hover:bg-white/5 btn-sharp">
              <Cloud size={16} /> Upload Asset
            </Link>
            <Link to="/settings" className="flex items-center gap-4 text-muted hover:text-white transition-all uppercase tracking-widest text-xs p-4 hover:bg-white/5 btn-sharp">
              <Settings size={16} /> Settings
            </Link>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-muted hover:text-red-500 transition-all uppercase tracking-widest text-xs p-4 hover:bg-red-500/5 btn-sharp"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto max-h-screen">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-accent flex items-center justify-center btn-sharp text-white text-2xl font-display font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold uppercase tracking-tighter">Welcome back, {user?.username}</h1>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted mt-1">
                  <span>{user?.email}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-accent">Free Plan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 bg-surface-2 border border-white/10 p-6 btn-sharp space-y-4">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
              <span className="text-muted">Storage Used</span>
              <span>{storagePercent.toFixed(1)}%</span>
            </div>
            <div className="h-1 bg-white/5 relative overflow-hidden btn-sharp">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                className="absolute top-0 left-0 h-full bg-accent"
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-muted">
              <span>{(storageUsed / 1024 / 1024).toFixed(1)} MB</span>
              <span>100 MB</span>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="SEARCH ASSETS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-1 border border-white/5 btn-sharp py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:border-accent outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="bg-surface-1 border border-white/5 p-4 btn-sharp flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              <div className="flex items-center gap-2 text-white">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {files.length} Assets Live
              </div>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-2 border border-white/10 btn-sharp overflow-hidden group hover:border-accent/40 transition-all duration-500 hover:electric-glow"
                >
                  <div className="aspect-[4/3] bg-black relative flex items-center justify-center overflow-hidden border-b border-white/5">
                    {file.mimeType.startsWith('image/') ? (
                      <img 
                        src={`${api.defaults.baseURL.replace('/api', '')}/f/${file.shortId}`} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <FileText size={48} className="text-accent opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">PDF Document</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
                      <button 
                        onClick={() => copyLink(file.publicUrl)}
                        className="p-4 bg-accent text-white btn-sharp hover:bg-accent-dark transition-all transform -translate-y-2 group-hover:translate-y-0 duration-500"
                        title="Copy Universal Link"
                      >
                        <Copy size={20} />
                      </button>
                      <a 
                        href={`/v/${file.shortId}`} 
                        className="p-4 bg-white text-black btn-sharp hover:bg-gray-200 transition-all transform -translate-y-2 group-hover:translate-y-0 duration-500 delay-75"
                        title="Preview Asset"
                      >
                        <Eye size={20} />
                      </a>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-display font-bold uppercase tracking-tight truncate text-sm" title={file.originalName}>
                      {file.originalName}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted">
                      <span className="flex items-center gap-2">
                        {file.mimeType.startsWith('image/') ? <ImageIcon size={12} /> : <FileText size={12} />}
                        {file.mimeType.split('/')[1]}
                      </span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-muted tracking-widest uppercase">
                        <Calendar size={10} />
                        {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      
                      <div className="relative">
                        <AnimatePresence>
                          {deleteConfirm === file._id ? (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3"
                            >
                              <button 
                                onClick={() => handleDelete(file._id)}
                                className="text-[9px] font-black uppercase text-red-500 hover:underline"
                              >
                                CONFIRM
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="text-[9px] font-black uppercase text-muted hover:text-white"
                              >
                                CANCEL
                              </button>
                            </motion.div>
                          ) : (
                            <button 
                              onClick={() => setDeleteConfirm(file._id)}
                              className="text-muted hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center bg-surface-1 border border-dashed border-white/10 btn-sharp">
            <Cloud size={48} className="text-muted mb-6" />
            <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-2">No assets detected</h3>
            <p className="text-muted font-body text-sm uppercase tracking-widest mb-10">Your universal cloud is currently empty</p>
            <Link to="/upload" className="bg-white text-black px-8 py-4 btn-sharp font-extrabold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
              Upload your first asset
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
