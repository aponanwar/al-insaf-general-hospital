'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, ShieldAlert, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token || !email) {
      setError('Invalid or missing password reset link. Please request a new one.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
        <p className="text-xs text-slate-400">
          The reset link appears to be incomplete or expired. Please request a fresh recovery email.
        </p>
        <Link
          href="/admin/forgot-password"
          className="inline-block py-2.5 px-5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow transition-all"
        >
          Request New Recovery Email
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Create New Password
        </h1>
        <p className="text-xs text-slate-400">
          Setting new credentials for <span className="text-emerald-400 font-semibold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-3 text-xs text-rose-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs text-emerald-300">
            <div className="flex items-center space-x-2 font-bold text-emerald-400">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Password Reset Successful!</span>
            </div>
            <p className="text-slate-300">
              Your administrator credentials have been securely updated. You can now log into the CMS.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Admin Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              New Password (min. 8 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-xs">Loading Password Reset...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
