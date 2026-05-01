export const movies = [
  {
    id: 1,
    title: 'Dune: Part Two',
    genre: 'Sci-Fi / Adventure',
    language: 'English',
    rating: 8.8,
    duration: '166 min',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster: null,
    posterColor: 'from-amber-900 to-orange-950',
    accentColor: '#f59e0b',
  },
  {
    id: 2,
    title: 'Oppenheimer',
    genre: 'Drama / History',
    language: 'English',
    rating: 8.9,
    duration: '180 min',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster: null,
    posterColor: 'from-slate-900 to-zinc-950',
    accentColor: '#ef4444',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    genre: 'Action / Crime',
    language: 'English',
    rating: 9.0,
    duration: '152 min',
    description:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
    poster: null,
    posterColor: 'from-gray-950 to-blue-950',
    accentColor: '#3b82f6',
  },
];

export const screens = [
  { id: 1, name: 'Screen 1 — IMAX', rows: 10, seatsPerRow: 10 },
  { id: 2, name: 'Screen 2 — 4DX', rows: 10, seatsPerRow: 10 },
];

export const shows = [
  {
    id: 1,
    movieId: 1,
    screenId: 1,
    screenName: 'Screen 1 — IMAX',
    startTime: '2026-05-02T10:00:00',
    price: 250,
    availableSeats: 45,
  },
  {
    id: 2,
    movieId: 1,
    screenId: 2,
    screenName: 'Screen 2 — 4DX',
    startTime: '2026-05-02T14:30:00',
    price: 350,
    availableSeats: 72,
  },
  {
    id: 3,
    movieId: 1,
    screenId: 1,
    screenName: 'Screen 1 — IMAX',
    startTime: '2026-05-03T19:00:00',
    price: 300,
    availableSeats: 20,
  },
  {
    id: 4,
    movieId: 2,
    screenId: 2,
    screenName: 'Screen 2 — 4DX',
    startTime: '2026-05-02T11:00:00',
    price: 400,
    availableSeats: 88,
  },
  {
    id: 5,
    movieId: 2,
    screenId: 1,
    screenName: 'Screen 1 — IMAX',
    startTime: '2026-05-02T18:00:00',
    price: 300,
    availableSeats: 30,
  },
  {
    id: 6,
    movieId: 3,
    screenId: 1,
    screenName: 'Screen 1 — IMAX',
    startTime: '2026-05-03T20:00:00',
    price: 200,
    availableSeats: 15,
  },
  {
    id: 7,
    movieId: 3,
    screenId: 2,
    screenName: 'Screen 2 — 4DX',
    startTime: '2026-05-04T17:30:00',
    price: 280,
    availableSeats: 62,
  },
];

const BOOKED = {
  1: ['A1','A2','B5','B6','C3','C4','D1','D2','D3','E8','E9','F2','F3'],
  2: ['B1','B2','B3','C7','C8','F4','F5','G1','G2'],
  3: ['A5','A6','A7','B8','B9','C1','D4','D5','E2','E3','F6','I1','I2','I3','I4','J1','J2','J3','J4','J5'],
  4: ['A1','B2','C3'],
  5: ['A1','A2','A3','A4','A5','B1','B2','B3','B4','B5','C1','C2','C3','D1','D2','E5','E6','F7','G8','H9','I1','I2','I3','J1'],
  6: ['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10','B1','B2','B3','B4','B5','C1','C2','C3','D1','D2','D3','E1','E2','F1','F2','G1','H1','I1','J1','J2'],
  7: ['A3','A4','B7','C2','D5','E8','F1'],
};

const HELD = {
  1: ['B3','B4','C8'],
  2: ['A7','A8'],
  3: ['G5','G6'],
  4: [],
  5: ['F3','F4'],
  6: ['B6','B7'],
  7: ['C5','C6'],
};

export function generateSeats(showId) {
  const rows = ['A','B','C','D','E','F','G','H','I','J'];
  const seats = [];
  rows.forEach(row => {
    for (let num = 1; num <= 10; num++) {
      const id = `${row}${num}`;
      const isPremium = ['I','J'].includes(row);
      let status = 'available';
      if (BOOKED[showId]?.includes(id)) status = 'booked';
      else if (HELD[showId]?.includes(id)) status = 'held';
      seats.push({ id, row, number: num, type: isPremium ? 'premium' : 'normal', status });
    }
  });
  return seats;
}

export function getShowsForMovie(movieId) {
  return shows.filter(s => s.movieId === movieId);
}

export function getMovieById(id) {
  return movies.find(m => m.id === id);
}

export function getShowById(id) {
  return shows.find(s => s.id === id);
}

export const mockPastBookings = [
  {
    id: 'BK1714890001',
    movieTitle: 'Dune: Part Two',
    showTime: '2026-04-20T14:30:00',
    screenName: 'Screen 1 — IMAX',
    seats: [
      { id: 'C5', type: 'normal' },
      { id: 'C6', type: 'normal' },
    ],
    totalPrice: 500,
    status: 'confirmed',
    posterColor: 'from-amber-900 to-orange-950',
  },
  {
    id: 'BK1714890002',
    movieTitle: 'Oppenheimer',
    showTime: '2026-04-15T18:00:00',
    screenName: 'Screen 2 — 4DX',
    seats: [{ id: 'E4', type: 'normal' }],
    totalPrice: 300,
    status: 'cancelled',
    posterColor: 'from-slate-900 to-zinc-950',
  },
  {
    id: 'BK1714890003',
    movieTitle: 'The Dark Knight',
    showTime: '2026-04-28T20:00:00',
    screenName: 'Screen 1 — IMAX',
    seats: [
      { id: 'I3', type: 'premium' },
      { id: 'I4', type: 'premium' },
      { id: 'I5', type: 'premium' },
    ],
    totalPrice: 750,
    status: 'confirmed',
    posterColor: 'from-gray-950 to-blue-950',
  },
];
