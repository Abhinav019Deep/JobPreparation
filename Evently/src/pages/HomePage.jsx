import { Sparkles, TrendingUp } from 'lucide-react';
import { movies } from '../data/mockData';
import MovieCard from '../components/MovieCard';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Hero */}
      <div className="relative overflow-hidden px-4 py-16 sm:py-20"
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #13131a 50%, #0a0a0f 100%)',
          borderBottom: '1px solid #1c1c26',
        }}>
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(230,57,70,0.08)' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.06)' }} />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(230,57,70,0.15)', color: '#e63946', border: '1px solid rgba(230,57,70,0.3)' }}>
            <Sparkles size={12} />
            Now Showing
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Your next great<br />
            <span style={{
              background: 'linear-gradient(90deg, #e63946, #f4a261)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              cinema experience
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Browse movies, pick your seats, and book in seconds.
            Real-time availability — no double bookings.
          </p>
        </div>
      </div>

      {/* Movies section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp size={20} style={{ color: '#e63946' }} />
          <h2 className="text-xl font-bold text-white">Now Showing</h2>
          <span className="ml-2 text-sm text-gray-500">— {movies.length} movies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="anim-fade-up"
              style={{ animationDelay: `${movies.indexOf(movie) * 80}ms` }}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
