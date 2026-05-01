import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Film, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [tab, setTab]         = useState('login');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = tab === 'login'
        ? login(form.email, form.password)
        : register(form.name, form.email, form.password);

      setLoading(false);
      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Something went wrong');
      }
    }, 600);
  };

  const inputCls = [
    'w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500',
    'outline-none transition-all duration-150 focus:ring-2',
  ].join(' ');

  const inputStyle = {
    background: '#13131a',
    border: '1px solid #2a2a3a',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: '#0a0a0f' }}>
      <div className="w-full max-w-md anim-scale-in">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}>
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">event</span>
              <span style={{ color: '#e63946' }}>ly</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden"
          style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>

          {/* Tabs */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #2a2a3a' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                className="py-4 text-sm font-semibold capitalize transition-colors"
                style={tab === t
                  ? { color: '#e63946', borderBottom: '2px solid #e63946' }
                  : { color: '#6b7280' }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-gray-400 pb-1">
              {tab === 'login'
                ? 'Welcome back. Sign in to access your bookings.'
                : 'Create an account to start booking tickets.'}
            </p>

            {tab === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Full name" value={form.name}
                  onChange={update('name')} required
                  className={inputCls} style={inputStyle} />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" placeholder="Email address" value={form.email}
                onChange={update('email')} required
                className={inputCls} style={inputStyle} />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" placeholder="Password" value={form.password}
                onChange={update('password')} required minLength={6}
                className={inputCls} style={inputStyle} />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ background: '#450a0a', border: '1px solid #7f1d1d' }}>
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}>
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : tab === 'login' ? (
                <><LogIn size={16} /> Sign In</>
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 pt-1">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
                className="underline" style={{ color: '#e63946' }}>
                {tab === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
