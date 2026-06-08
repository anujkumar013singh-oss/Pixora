import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, CreditCard, HardDrive, Zap, Loader2 } from 'lucide-react';

const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      await refreshUser();
      setLoading(false);
    };
    loadUserData();
  }, []);

  const storageLimit = user?.plan === 'free' ? 100 * 1024 * 1024 : 1024 * 1024 * 1024; // 100MB or 1GB
  const storageUsed = user?.storageUsed || 0;
  const storagePercent = Math.min((storageUsed / storageLimit) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Account Info */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Account Information</h2>
              <p className="text-gray-400 text-sm">Your personal details and email</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <div className="bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white">
                {user?.email}
              </div>
            </div>
          </div>
        </section>

        {/* Storage Usage */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Storage Usage</h2>
              <p className="text-gray-400 text-sm">Track your cloud storage</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Used: {(storageUsed / 1024 / 1024).toFixed(2)} MB</span>
              <span className="text-gray-400">Total: {(storageLimit / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-accent h-full transition-all duration-500" 
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              You are currently using {storagePercent.toFixed(1)}% of your {user?.plan} plan storage.
            </p>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Plan & Billing</h2>
              <p className="text-gray-400 text-sm">Manage your subscription</p>
            </div>
          </div>
          
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold capitalize">{user?.plan} Plan</h3>
              <p className="text-gray-400 text-sm">Upgrade for more storage and features.</p>
            </div>
            <button className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-xl font-bold transition-all electric-glow whitespace-nowrap">
              Upgrade Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
