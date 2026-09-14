'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldAlert, CheckCircle, Send, KeyRound, ExternalLink } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('admin@hospital.com');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);
    setDevResetUrl(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request password recovery.');
      }

      setSuccess(true);
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Recover Admin Password
          </h1>
          <p className="text-xs text-slate-400">
            Enter your registered admin email to receive a secure password reset link.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-3 text-xs text-rose-300">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-xs text-emerald-300">
              <div className="flex items-center space-x-2 font-bold text-emerald-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Recovery Email Dispatched</span>
              </div>
              <p className="text-slate-300">
                If an account exists for <strong>{email}</strong>, a reset link valid for <strong>15 minutes</strong> has been sent. Please check your inbox.
              </p>
            </div>

            {devResetUrl && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2 text-xs text-amber-300">
                <div className="font-bold flex items-center">
                  <span>⚡ Dev Mode Direct Reset Link:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  (Shown automatically in local dev mode when SMTP is in test mode)
                </p>
                <Link
                  href={devResetUrl}
                  className="inline-flex items-center text-xs font-bold text-amber-400 hover:text-amber-300 underline break-all"
                >
                  <span>Open Password Reset Page</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
            )}

            <Link
              href="/admin/login"
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Admin Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Administrator Email *
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Recovery Link...' : 'Send Recovery Email'}</span>
            </button>

            <div className="text-center pt-2">
              <Link
                href="/admin/login"
                className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Back to Admin Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
