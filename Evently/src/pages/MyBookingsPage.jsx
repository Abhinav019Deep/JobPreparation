import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Monitor, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function StatusBadge({ status }) {
  const map = {
    confirmed: 'badge-confirmed',
    cancelled:  'badge-cancelled',
    pending:    'badge-pending',
  };
  return (
    <span className={`${map[status] || ''} px-2.5 py-1 rounded-full text-xs font-semibold capitalize`}>
      {status}
    </span>
  );
}

function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>
      <div className={`h-1 bg-gradient-to-r ${booking.posterColor || 'from-gray-800 to-gray-900'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-bold text-white mb-1">{booking.movieTitle}</h3>
            <p className="text-xs text-gray-500 font-mono">{booking.id}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={12} /> {formatDate(booking.showTime)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Monitor size={12} /> {booking.screenName}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Ticket size={12} /> {booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">₹{booking.totalPrice}</span>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Less' : 'Details'}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: '#2a2a3a' }}>
            <div>
              <p className="text-xs text-gray-500 mb-2">Seats</p>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats.map(s => (
                  <span key={s.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: s.type === 'premium' ? '#4c1d95' : '#1e3a5f',
                      color:      s.type === 'premium' ? '#c4b5fd' : '#93c5fd',
                    }}>
                    {s.id}
                  </span>
                ))}
              </div>
            </div>

            {booking.status === 'confirmed' && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                Email confirmation sent • PDF ticket available
              </div>
            )}

            {booking.status === 'pending' && (
              <button
                onClick={() => onCancel(booking.id)}
                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                <XCircle size={13} /> Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { bookings, cancelBooking } = useBooking();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">My Bookings</h1>
          <p className="text-sm text-gray-500">Logged in as {user?.email}</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-150"
              style={filter === f
                ? { background: '#e63946', color: '#fff' }
                : { background: '#1c1c26', color: '#9ca3af', border: '1px solid #2a2a3a' }}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Ticket size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-400 mb-2">No {filter !== 'all' ? filter : ''} bookings yet</p>
            <button onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 rounded-lg text-sm text-white"
              style={{ background: '#e63946' }}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b, i) => (
              <div key={b.id} className="anim-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <BookingCard booking={b} onCancel={cancelBooking} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
