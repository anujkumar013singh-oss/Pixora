import { useState, useRef } from 'react';
import { removeBg } from '../api/conversion';
import { motion, AnimatePresence } from 'framer-motion';

export default function RemoveBgWidget({ onConversion }) {
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copiedShort, setCopiedShort] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setImageUrl(''); setError(''); setResult(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setResult(null);
    if (!file && !imageUrl.trim()) { setError('Choose a file or paste a URL'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append('image', file);
      else fd.append('imageUrl', imageUrl.trim());
      const { data } = await removeBg(fd);
      setResult(data);
      if (onConversion) onConversion(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Background removal failed');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text, setter) => {
    try { await navigator.clipboard.writeText(text); setter(true); setTimeout(() => setter(false), 2000); } catch {}
  };

  const clear = () => {
    setFile(null); setPreview(''); setImageUrl(''); setError(''); setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const universalLink = result?.pixoraLink || '';
  const shortCode = result?.shortCode || '';

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-zinc-800/40 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800/30">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-600/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Remove Background</h2>
          <p className="text-xs text-zinc-500" style={{ fontFamily: "'Cabin', sans-serif" }}>Strip backgrounds from any image</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex gap-1 p-1 bg-zinc-900/60 rounded-xl mb-6 border border-zinc-800/30">
          {[
            { key: 'upload', label: 'Upload' },
            { key: 'url', label: 'Paste URL' },
          ].map((m) => (
            <button key={m.key}
              onClick={() => { setMode(m.key); clear(); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === m.key ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={{ fontFamily: "'Sen', sans-serif" }}>
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div key="e" initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-xs"
                style={{ fontFamily: "'Cabin', sans-serif" }}>{error}</motion.div>
            )}
          </AnimatePresence>

          {mode === 'upload' ? (
            <div className="relative border-2 border-dashed border-zinc-700/50 rounded-xl p-8 text-center group hover:border-cyan-500/40 transition-all duration-500 cursor-pointer"
              onClick={() => fileRef.current?.click()}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="" className="max-h-40 mx-auto rounded-lg" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }}
                    className="mt-2 text-xs text-zinc-500 hover:text-red-400 transition">Remove</button>
                </div>
              ) : (
                <div>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-zinc-400" style={{ fontFamily: "'Cabin', sans-serif" }}>Drop image or click to browse</p>
                  <p className="text-xs text-zinc-600 mt-1" style={{ fontFamily: "'Cabin', sans-serif" }}>PNG, JPG, WebP — up to 10MB</p>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>
              )}
            </div>
          ) : (
            <input type="text" value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-zinc-900/60 border border-zinc-700/50 rounded-xl px-5 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
              style={{ fontFamily: "'Cabin', sans-serif" }} />
          )}

          <motion.button type="submit" disabled={loading || (!file && !imageUrl.trim())}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="relative w-full py-3 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-600/15"
            style={{ fontFamily: "'Sen', sans-serif" }}>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600" />
            <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent_60%)]" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Removing background…</span></>
              ) : 'Remove Background'}
            </span>
          </motion.button>
        </form>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: 20, height: 0 }}
              className="mt-5 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium tracking-wider text-cyan-400 uppercase"
                      style={{ fontFamily: "'Chakra Petch', monospace" }}>Background Removed</span>
                {shortCode && (
                  <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900/60 px-2 py-0.5 rounded-md border border-zinc-800/30"
                        style={{ fontFamily: "'Chakra Petch', monospace" }}>
                    /s/{shortCode}
                  </span>
                )}
              </div>
              {/* Universal link (primary) */}
              <div className="flex items-center justify-between gap-3 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/30">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500 mb-0.5" style={{ fontFamily: "'Cabin', sans-serif" }}>Universal link</p>
                  <p className="text-sm text-white truncate" style={{ fontFamily: "'Sen', sans-serif" }}>{universalLink}</p>
                </div>
                <button onClick={() => copy(universalLink, setCopiedShort)}
                  className="flex-shrink-0 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20"
                  style={{ fontFamily: "'Sen', sans-serif" }}>
                  {copiedShort ? 'Copied' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
