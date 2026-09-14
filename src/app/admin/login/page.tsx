'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ShieldAlert, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  const redirectTo =
    rawFrom &&
    !rawFrom.includes('/admin/login') &&
    !rawFrom.includes('/admin/forgot-password') &&
    !rawFrom.includes('/admin/reset-password')
      ? rawFrom
      : '/admin/dashboard';

  const [email, setEmail] = useState('admin@hospital.com');
  const [password, setPassword] = useState('AdminHospital@2026#Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      setSuccess(true);
      // Ensure smooth navigation to dashboard
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 200);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleFillDefaults = () => {
    setEmail('admin@hospital.com');
    setPassword('AdminHospital@2026#Secure');
    setError('');
  };

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl space-y-7">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Hospital Admin Portal
        </h1>
        <p className="text-xs text-slate-400">
          Al Insaf General Hospital CMS & Patient Management
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-3 text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>Authentication successful! Redirecting to Dashboard...</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : success ? 'Signing In...' : 'Sign In to Dashboard'}</span>
          </button>
        </div>
      </form>

      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-300">Default Admin Credentials:</span>
          <button
            type="button"
            onClick={handleFillDefaults}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline"
          >
            Auto Fill
          </button>
        </div>
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span>Email:</span>
          <code className="text-emerald-400">admin@hospital.com</code>
        </div>
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span>Pass:</span>
          <code className="text-emerald-400">AdminHospital@2026#Secure</code>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-xs">Loading Admin Login...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
