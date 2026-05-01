import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Monitor, Ticket, Users } from 'lucide-react';
import { getMovieById, getShowsForMovie } from '../data/mockData';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function AvailabilityBadge({ count }) {
  if (count <= 15) return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#450a0a', color: '#f87171' }}>
      {count} left
    </span>
  );
  if (count <= 40) return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#451a03', color: '#fbbf24' }}>
      {count} available
    </span>
  );
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#14532d', color: '#4ade80' }}>
      {count} available
    </span>
  );
}

export default function ShowSelectionPage() {
  const { movieId }  = useParams();
  const navigate     = useNavigate();
  const movie        = getMovieById(Number(movieId));
  const shows        = getShowsForMovie(Number(movieId));

  if (!movie) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Movie not found</div>
  );

  // Group by date
  const grouped = shows.reduce((acc, show) => {
    const date = formatDate(show.startTime);
    if (!acc[date]) acc[date] = [];
    acc[date].push(show);
    return acc;
  }, {});

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Movie header */}
      <div className="relative overflow-hidden"
        style={{ borderBottom: '1px solid #1c1c26', background: '#13131a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Movies
          </button>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster thumbnail */}
            <div className={`w-24 h-36 rounded-xl bg-gradient-to-b ${movie.posterColor} flex-shrink-0`} />

            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: movie.accentColor }}>
                {movie.genre}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-gray-400 text-sm mb-4 max-w-xl leading-relaxed">{movie.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={12} /> {movie.duration}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  {movie.language}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shows */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Ticket size={20} style={{ color: '#e63946' }} />
          <h2 className="text-lg font-bold text-white">Select a Show</h2>
        </div>

        {Object.entries(grouped).map(([date, dayShows]) => (
          <div key={date} className="mb-8 anim-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-300">{date}</span>
              <div className="flex-1 h-px" style={{ background: '#1c1c26' }} />
            </div>

            <div className="grid gap-3">
              {dayShows.map(show => (
                <button
                  key={show.id}
                  onClick={() => navigate(`/shows/${show.id}/seats`)}
                  className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 group hover:-translate-y-0.5"
                  style={{
                    background: '#1c1c26',
                    border: '1px solid #2a2a3a',
                    cursor: show.availableSeats === 0 ? 'not-allowed' : 'pointer',
                    opacity: show.availableSeats === 0 ? 0.5 : 1,
                  }}
                  disabled={show.availableSeats === 0}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-base font-bold text-white mb-1">
                          {formatTime(show.startTime)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Monitor size={11} />
                          {show.screenName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <AvailabilityBadge count={show.availableSeats} />
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">₹{show.price}</div>
                        <div className="text-xs text-gray-500">per seat</div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-red-900/40"
                        style={{ background: '#2a2a3a' }}>
                        <ArrowLeft size={14} className="text-gray-400 rotate-180" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
