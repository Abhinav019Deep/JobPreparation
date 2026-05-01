import { Star, Clock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
      style={{
        background: '#1c1c26',
        border: '1px solid #2a2a3a',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
      onClick={() => navigate(`/movies/${movie.id}/shows`)}
    >
      {/* Poster */}
      <div
        className={`relative h-72 bg-gradient-to-b ${movie.posterColor} flex items-end p-4`}
        style={{ overflow: 'hidden' }}
      >
        {/* Fake film grain overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />
        {/* Rating badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.7)', color: '#fbbf24', backdropFilter: 'blur(4px)' }}
        >
          <Star size={11} fill="#fbbf24" />
          {movie.rating}
        </div>
        {/* Title on poster */}
        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: movie.accentColor, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            {movie.genre}
          </div>
          <h3 className="text-xl font-bold text-white leading-tight"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            {movie.title}
          </h3>
        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to top, rgba(28,28,38,1), transparent)' }} />
      </div>

      {/* Card body */}
      <div className="p-4">
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {movie.description}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} /> {movie.duration}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Globe size={12} /> {movie.language}
          </span>
        </div>

        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movies/${movie.id}/shows`);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
