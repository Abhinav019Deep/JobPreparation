import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, CheckCircle2, Loader2, Tag } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export default function PaymentPage() {
  const navigate              = useNavigate();
  const { currentBooking, confirmBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed]   = useState(false);

  if (!currentBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-400">No active booking found.</p>
        <button onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: '#e63946' }}>
          Go Home
        </button>
      </div>
    );
  }

  const { movieTitle, showTime, screenName, seats, basePrice, totalPrice, posterColor } = currentBooking;
  const premiumSeats = seats.filter(s => s.type === 'premium');
  const normalSeats  = seats.filter(s => s.type === 'normal');

  const handlePay = () => {
    setLoading(true);
    setFailed(false);
    // Simulate webhook + payment processing
    setTimeout(() => {
      setLoading(false);
      // 95% success rate simulation
      if (Math.random() > 0.05) {
        confirmBooking();
        navigate('/confirmation');
      } else {
        setFailed(true);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-bold text-white mb-8">Review & Pay</h1>

        {/* Booking summary card */}
        <div className="rounded-2xl overflow-hidden mb-6"
          style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>

          {/* Movie stripe */}
          <div className={`h-2 bg-gradient-to-r ${posterColor}`} />

          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-24 rounded-xl bg-gradient-to-b ${posterColor} flex-shrink-0`} />
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{movieTitle}</h2>
                <p className="text-sm text-gray-400 mb-1">{formatTime(showTime)}</p>
                <p className="text-sm text-gray-500">{screenName}</p>
              </div>
            </div>

            {/* Seats */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Selected Seats
              </p>
              <div className="flex flex-wrap gap-2">
                {seats.map(s => (
                  <span key={s.id}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                    style={{
                      background: s.type === 'premium' ? '#4c1d95' : '#1e3a5f',
                      color:      s.type === 'premium' ? '#c4b5fd' : '#93c5fd',
                    }}>
                    {s.id}
                    {s.type === 'premium' && <span className="ml-1 text-xs opacity-70">P</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-xl p-4" style={{ background: '#13131a' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Price Breakdown
              </p>
              {normalSeats.length > 0 && (
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{normalSeats.length} × Standard (₹{basePrice})</span>
                  <span>₹{normalSeats.length * basePrice}</span>
                </div>
              )}
              {premiumSeats.length > 0 && (
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{premiumSeats.length} × Premium (₹{basePrice + 100})</span>
                  <span>₹{premiumSeats.length * (basePrice + 100)}</span>
                </div>
              )}
              <div className="h-px my-3" style={{ background: '#2a2a3a' }} />
              <div className="flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-xl" style={{ color: '#e63946' }}>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
          style={{ background: '#14532d22', border: '1px solid #14532d' }}>
          <Shield size={14} className="text-green-400 flex-shrink-0" />
          <p className="text-xs text-green-300">
            Payments are processed securely. This is a simulated payment for demonstration.
          </p>
        </div>

        {/* Payment failure alert */}
        {failed && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
            style={{ background: '#450a0a', border: '1px solid #7f1d1d' }}>
            <p className="text-sm text-red-300">
              Payment failed. Your seats are still held. Please try again.
            </p>
          </div>
        )}

        {/* Mocked payment method */}
        <div className="rounded-2xl p-5 mb-6"
          style={{ background: '#1c1c26', border: '1px solid #2a2a3a' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: '#2a2a3a' }}>
              <CreditCard size={18} className="text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-500">Visa — Expires 12/26 (Demo card)</p>
            </div>
            <div className="ml-auto">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
          </div>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}>
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing payment…
            </>
          ) : (
            <>
              <Tag size={18} />
              Pay ₹{totalPrice}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
