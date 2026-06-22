import { useState, useEffect, useCallback } from 'react';
import { getHistory } from '../api/history';
import { motion, AnimatePresence } from 'framer-motion';

const typeConfig = {
  'converted': { label: 'Converted', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  'already-universal': { label: 'Already Universal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  'bg-removed': { label: 'BG Removed', color: 'text-cyan-400', bg: 'bg-cyan-500/10', dot: 'bg-cyan-400' }
};

export default function HistoryList({ refreshTrigger }) {
  const [conversions, setConversions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, hasMore: false, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchHistory = useCallback(async (page = 1) => {
    setLoading(true); setError('');
    try {
      const { data } = await getHistory(page, 10);
      setConversions(data.conversions);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(1); }, [fetchHistory, refreshTrigger]);

  const copyLink = async (id, link) => {
    try { await navigator.clipboard.writeText(link); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); } catch {}
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-zinc-800/40 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>History</h2>
            <p className="text-xs text-zinc-500" style={{ fontFamily: "'Cabin', sans-serif" }}>{pagination.total} total conversions</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading && conversions.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-xs">{error}</div>
        ) : conversions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-zinc-800/30 flex items-center justify-center text-zinc-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500" style={{ fontFamily: "'Cabin', sans-serif" }}>No conversions yet</p>
            <p className="text-xs text-zinc-600 mt-1" style={{ fontFamily: "'Cabin', sans-serif" }}>Upload an image above to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {conversions.map((conv, i) => {
                const tc = typeConfig[conv.type] || typeConfig['converted'];
                const universal = conv.pixoraLink || '';
                return (
                  <motion.div key={conv.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group flex items-center gap-4 p-3.5 bg-zinc-900/30 hover:bg-zinc-900/60 rounded-xl border border-zinc-800/20 hover:border-zinc-700/30 transition-all duration-300"
                  >
                    {/* Thumb */}
                    <div className="rounded-lg overflow-hidden flex-shrink-0 w-14 bg-zinc-800/50">
                      {conv.thumbnailUrl ? (
                        <img src={conv.thumbnailUrl} alt="" className="w-full h-auto" />
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center text-zinc-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                        <span className={`text-[11px] font-medium ${tc.color}`}
                              style={{ fontFamily: "'Chakra Petch', monospace" }}>{tc.label}</span>
                        {conv.shortCode && (
                          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800/30"
                                style={{ fontFamily: "'Chakra Petch', monospace" }}>
                            /s/{conv.shortCode}
                          </span>
                        )}
                        <span className="text-[11px] text-zinc-600" style={{ fontFamily: "'Cabin', sans-serif" }}>
                          {new Date(conv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 truncate"
                         style={{ fontFamily: "'Sen', sans-serif" }}>{universal}</p>
                    </div>

                    {/* Copy */}
                    <button onClick={() => copyLink(conv.id, conv.pixoraLink)}
                      className="flex-shrink-0 text-zinc-600 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      title="Copy full URL">
                      {copiedId === conv.id ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-zinc-800/20">
            <button onClick={() => fetchHistory(pagination.page - 1)} disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-800/50 transition-all"
              style={{ fontFamily: "'Sen', sans-serif" }}>Previous</button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => fetchHistory(p)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  p === pagination.page ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                }`}
                style={{ fontFamily: "'Sen', sans-serif" }}>{p}</button>
            ))}
            <button onClick={() => fetchHistory(pagination.page + 1)} disabled={!pagination.hasMore}
              className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-800/50 transition-all"
              style={{ fontFamily: "'Sen', sans-serif" }}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
