import { createContext, useContext, useState } from 'react';
import { mockPastBookings } from '../data/mockData';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookings, setBookings] = useState(mockPastBookings);

  const initBooking = (movie, show, selectedSeats) => {
    const premiumCount = selectedSeats.filter(s => s.type === 'premium').length;
    const normalCount  = selectedSeats.length - premiumCount;
    const total = normalCount * show.price + premiumCount * (show.price + 100);

    const booking = {
      id: 'BK' + Date.now(),
      movieId:    movie.id,
      movieTitle: movie.title,
      posterColor: movie.posterColor,
      showId:     show.id,
      showTime:   show.startTime,
      screenName: show.screenName,
      seats:      selectedSeats,
      basePrice:  show.price,
      totalPrice: total,
      status:     'pending',
      createdAt:  new Date().toISOString(),
    };
    setCurrentBooking(booking);
    return booking;
  };

  const confirmBooking = () => {
    if (!currentBooking) return null;
    const confirmed = { ...currentBooking, status: 'confirmed' };
    setCurrentBooking(confirmed);
    setBookings(prev => [confirmed, ...prev]);
    return confirmed;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    );
  };

  return (
    <BookingContext.Provider value={{ currentBooking, bookings, initBooking, confirmBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
