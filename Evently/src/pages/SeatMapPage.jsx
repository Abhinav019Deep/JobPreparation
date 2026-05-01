import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, CheckCircle2, Wifi } from 'lucide-react';
import { getShowById, getMovieById, generateSeats } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const MAX_SEATS      = 6;
const HOLD_SECONDS   = 300; // 5 minutes

function SeatButton({ seat, isSelected, onClick }) {
  let cls = 'seat ';
  if (isSelected)             cls += 'seat-selected';
  else if (seat.status === 'booked') cls += 'seat-booked';
  else if (seat.status === 'held')   cls += 'seat-held';
  else if (seat.type === 'premium')  cls += 'seat-available seat-premium';
  else                               cls += 'seat-available';

  return (
    <button
      className={cls}
      title={`${seat.id} — ${seat.type}`}
      onClick={() => onClick(seat)}
      disabled={seat.status === 'booked' || seat.status === 'held'}
    >
      <span className="sr-only">{seat.id}</span>
    </button>
  );
}

function Timer({ seconds }) {
  const m   = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s   = String(seconds % 60).padStart(2, '0');
  const low = seconds <= 60;
  return (
    <span style={{ color: low ? '#ef4444' : '#4ade80', fontVariantNumeric: 'tabular-nums' }}
      className="font-mono text-lg font-bold">
      {m}:{s}
    </span>
  );
}

export default function SeatMapPage() {
  const { showId }    = useParams();
  const navigate      = useNavigate();
  const { initBooking } = useBooking();
  const { isAuthenticated } = useAuth();

  const show  = getShowById(Number(showId));
  const movie = show ? getMovieById(show.movieId) : null;
  const [seats, setSeats]           = useState(() => show ? generateSeats(show.id) : []);
  const [selected, setSelected]     = useState([]);
  const [timeLeft, setTimeLeft]     = useState(HOLD_SECONDS);
  const [timerActive, setTimerActive] = useState(false);

  // Start 5-min countdown once user picks first seat
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setSelected([]);
      setTimerActive(false);
      setTimeLeft(HOLD_SECONDS);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timeLeft]);

  const toggleSeat = useCallback((seat) => {
    if (seat.status === 'booked' || seat.status === 'held') return;
    setSelected(prev => {
      const already = prev.some(s => s.id === seat.id);
      if (already) {
        const next = prev.filter(s => s.id !== seat.id);
        if (next.length === 0) { setTimerActive(false); setTimeLeft(HOLD_SECONDS); }
        return next;
      }
      if (prev.length >= MAX_SEATS) return prev;
      if (!timerActive) setTimerActive(true);
      return [...prev, seat];
    });
  }, [timerActive]);

  const handleProceed = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/shows/${showId}/seats` } } });
      return;
    }
    if (selected.length === 0) return;
    initBooking(movie, show, selected);
    navigate('/payment');
  };

  if (!show || !movie) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Show not found</div>
  );

  const rows = ['A','B','C','D','E','F','G','H','I','J'];
  const totalPrice = selected.reduce((sum, s) => {
    return sum + show.price + (s.type === 'premium' ? 100 : 0);
  }, 0);

  const counts = seats.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Top bar */}
      <div style={{ background: '#13131a', borderBottom: '1px solid #1c1c26' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <button onClick={() => navigate(`/movies/${movie.id}/shows`)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> {movie.title}
          </button>

          <div className="flex items-center gap-4">
            {/* SignalR indicator (visual only) */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-400">
              <Wifi size={12} className="animate-pulse" />
              Live updates
            </div>
            {timerActive && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>
                <Clock size={13} className="text-gray-400" />
                <span className="text-xs text-gray-400">Hold expires in</span>
                <Timer seconds={timeLeft} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Screen */}
        <div className="text-center mb-10">
          <div className="inline-block w-64 h-2 screen-bar mb-2" />
          <p className="text-xs text-blue-300/60 font-medium tracking-widest uppercase">Screen</p>
        </div>

        {/* Seat grid */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            {rows.map(row => (
              <div key={row} className="flex items-center gap-1.5 mb-2 justify-center">
                {/* Row label */}
                <span className="w-5 text-center text-xs font-mono text-gray-600 flex-shrink-0">
                  {row}
                </span>
                {/* Seats */}
                <div className="flex gap-1.5">
                  {seats
                    .filter(s => s.row === row)
                    .map(seat => (
                      <SeatButton
                        key={seat.id}
                        seat={seat}
                        isSelected={selected.some(s => s.id === seat.id)}
                        onClick={toggleSeat}
                      />
                    ))}
                </div>
                {/* Row label (right) */}
                <span className="w-5 text-center text-xs font-mono text-gray-600 flex-shrink-0">
                  {row}
                </span>
              </div>
            ))}
            {/* Seat numbers bottom */}
            <div className="flex gap-1.5 justify-center mt-2 pl-7 pr-7">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="text-center text-xs font-mono text-gray-700"
                  style={{ width: 30, flexShrink: 0 }}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-8 mb-10">
          {[
            { cls: 'seat-available', label: `Available (${counts.available || 0})` },
            { cls: 'seat-available seat-premium', label: 'Premium (+₹100)' },
            { cls: 'seat-selected', label: 'Your selection' },
            { cls: 'seat-held', label: `On hold (${counts.held || 0})` },
            { cls: 'seat-booked', label: `Booked (${counts.booked || 0})` },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`seat ${cls}`} style={{ width: 20, height: 16, pointerEvents: 'none', borderRadius: 3 }} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Max seats notice */}
        {selected.length >= MAX_SEATS && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 max-w-md mx-auto"
            style={{ background: '#451a03', border: '1px solid #92400e' }}>
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300">Maximum {MAX_SEATS} seats per booking</p>
          </div>
        )}

        {/* Sticky bottom summary */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4"
          style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1c1c26' }}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

            {selected.length === 0 ? (
              <p className="text-sm text-gray-500">Select up to {MAX_SEATS} seats to continue</p>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">Selected:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.map(s => (
                    <button
                      key={s.id}
                      onClick={() => toggleSeat(s)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70"
                      style={{
                        background: s.type === 'premium' ? '#4c1d95' : '#1e3a5f',
                        color: s.type === 'premium' ? '#c4b5fd' : '#93c5fd',
                      }}>
                      {s.id} ×
                    </button>
                  ))}
                </div>
                <span className="text-lg font-bold text-white">₹{totalPrice}</span>
              </div>
            )}

            <button
              onClick={handleProceed}
              disabled={selected.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)', minWidth: 180 }}>
              <CheckCircle2 size={16} />
              {isAuthenticated ? 'Proceed to Payment' : 'Sign in to Book'}
            </button>
          </div>
        </div>

        {/* Spacer for sticky bar */}
        <div className="h-24" />
      </div>
    </div>
  );
}
