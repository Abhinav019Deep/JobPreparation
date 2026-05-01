import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Download, CalendarCheck, Monitor, Ticket } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// Simple CSS-drawn QR code — deterministic pattern from booking ID
function QRCode({ bookingId }) {
  const size   = 15;
  const cells  = [];

  // Finder patterns (corners)
  const finderTopLeft    = (r, c) => (r < 7 && c < 7);
  const finderTopRight   = (r, c) => (r < 7 && c >= size - 7);
  const finderBottomLeft = (r, c) => (r >= size - 7 && c < 7);

  const isFinderCell = (r, c) => finderTopLeft(r, c) || finderTopRight(r, c) || finderBottomLeft(r, c);
  const isFinderBorder = (r, c) => {
    const inFTL = r <= 6 && c <= 6;
    const inFTR = r <= 6 && c >= size - 7;
    const inFBL = r >= size - 7 && c <= 6;
    if (inFTL) return r === 0 || r === 6 || c === 0 || c === 6;
    if (inFTR) return r === 0 || r === 6 || c === size - 7 || c === size - 1;
    if (inFBL) return r === size - 7 || r === size - 1 || c === 0 || c === 6;
    return false;
  };

  // Hash bookingId for deterministic data cells
  let hash = 0;
  for (let i = 0; i < bookingId.length; i++) {
    hash = ((hash << 5) - hash) + bookingId.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let filled = false;
      if (isFinderCell(r, c)) {
        filled = isFinderBorder(r, c)
          ? true
          : (r >= 1 && r <= 5 && c >= 1 && c <= 5
              ? (r >= 2 && r <= 4 && c >= 2 && c <= 4)
              : false);
        if (finderTopRight(r, c)) {
          const localC = c - (size - 7);
          filled = (r === 0 || r === 6 || localC === 0 || localC === 6)
            ? true
            : (r >= 2 && r <= 4 && localC >= 2 && localC <= 4);
        }
        if (finderBottomLeft(r, c)) {
          const localR = r - (size - 7);
          filled = (localR === 0 || localR === 6 || c === 0 || c === 6)
            ? true
            : (localR >= 2 && localR <= 4 && c >= 2 && c <= 4);
        }
      } else {
        // Timing pattern
        if (r === 6 || c === 6) { filled = (r + c) % 2 === 0; }
        else {
          const bit = ((hash >> ((r * size + c) % 31)) & 1) ^ ((r + c) % 3 === 0 ? 1 : 0);
          filled = bit === 1;
        }
      }
      cells.push({ r, c, filled });
    }
  }

  const cell = 14;
  return (
    <div style={{ display: 'inline-block', background: '#fff', padding: 12, borderRadius: 8 }}>
      <svg width={size * cell} height={size * cell} viewBox={`0 0 ${size * cell} ${size * cell}`}>
        {cells.map(({ r, c, filled }) =>
          filled ? (
            <rect key={`${r}-${c}`}
              x={c * cell} y={r * cell} width={cell} height={cell} fill="#000" />
          ) : null
        )}
      </svg>
    </div>
  );
}

export default function ConfirmationPage() {
  const navigate             = useNavigate();
  const { currentBooking }   = useBooking();
  const didRedirect          = useRef(false);

  useEffect(() => {
    if (!currentBooking || currentBooking.status !== 'confirmed') {
      if (!didRedirect.current) {
        didRedirect.current = true;
        navigate('/');
      }
    }
  }, [currentBooking, navigate]);

  if (!currentBooking || currentBooking.status !== 'confirmed') return null;

  const { id, movieTitle, showTime, screenName, seats, totalPrice, posterColor } = currentBooking;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#0a0a0f' }}>

      {/* Success indicator */}
      <div className="anim-scale-in flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}>
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(34,197,94,0.1)', animationDuration: '2s' }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 text-sm">Your tickets have been booked successfully.</p>
      </div>

      {/* Ticket card */}
      <div className="w-full max-w-md anim-fade-up rounded-2xl overflow-hidden"
        style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>

        {/* Top stripe */}
        <div className={`h-2 bg-gradient-to-r ${posterColor}`} />

        <div className="p-6">
          {/* Booking ID */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Booking ID</p>
            <p className="font-mono text-sm font-bold text-white">{id}</p>
          </div>

          {/* Dotted separator */}
          <div className="flex items-center gap-2 my-4">
            <div className="w-4 h-4 rounded-full -ml-8" style={{ background: '#0a0a0f' }} />
            <div className="flex-1 border-t border-dashed" style={{ borderColor: '#2a2a3a' }} />
            <div className="w-4 h-4 rounded-full -mr-8" style={{ background: '#0a0a0f' }} />
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <Ticket size={15} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Movie</p>
                <p className="text-sm font-semibold text-white">{movieTitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarCheck size={15} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Show Time</p>
                <p className="text-sm font-semibold text-white">{formatTime(showTime)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Monitor size={15} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Screen</p>
                <p className="text-sm font-semibold text-white">{screenName}</p>
              </div>
            </div>
          </div>

          {/* Seats */}
          <div className="rounded-xl p-4 mb-6" style={{ background: '#13131a' }}>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Seats</p>
            <div className="flex flex-wrap gap-2">
              {seats.map(s => (
                <span key={s.id}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{
                    background: s.type === 'premium' ? '#4c1d95' : '#1e3a5f',
                    color:      s.type === 'premium' ? '#c4b5fd' : '#93c5fd',
                  }}>
                  {s.id}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3"
              style={{ borderTop: '1px solid #2a2a3a' }}>
              <span className="text-sm text-gray-400">Total Paid</span>
              <span className="text-lg font-bold text-white">₹{totalPrice}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <QRCode bookingId={id} />
          </div>
          <p className="text-center text-xs text-gray-500 mb-6">
            Show this QR code at the cinema entrance
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}
              onClick={() => alert('PDF ticket download — would generate via backend worker in production.')}>
              <Download size={16} />
              Download Ticket (PDF)
            </button>
            <Link to="/my-bookings"
              className="w-full py-3 rounded-xl font-semibold text-center text-gray-300 transition-colors hover:text-white"
              style={{ background: '#2a2a3a' }}>
              View My Bookings
            </Link>
            <Link to="/"
              className="text-center text-sm text-gray-500 hover:text-gray-300 transition-colors py-1">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
