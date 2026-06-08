import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Ticket, LogOut, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path ? 'text-white' : 'text-gray-400 hover:text-white';

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10"
      style={{ background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}>
            <Film size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">event</span>
            <span style={{ color: '#e63946' }}>ly</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>
            Movies
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings"
              className={`text-sm font-medium transition-colors ${isActive('/my-bookings')}`}>
              My Bookings
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>
                <User size={14} className="text-gray-400" />
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout from Evently</span>
              </button>
            </>
          ) : (
            <Link to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}>
              <LogIn size={14} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
