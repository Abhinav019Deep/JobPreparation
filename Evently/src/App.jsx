import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar              from './components/Navbar';
import ProtectedRoute      from './components/ProtectedRoute';

import HomePage            from './pages/HomePage';
import ShowSelectionPage   from './pages/ShowSelectionPage';
import SeatMapPage         from './pages/SeatMapPage';
import PaymentPage         from './pages/PaymentPage';
import ConfirmationPage    from './pages/ConfirmationPage';
import MyBookingsPage      from './pages/MyBookingsPage';
import LoginPage           from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"                       element={<HomePage />} />
                <Route path="/movies/:movieId/shows"  element={<ShowSelectionPage />} />
                <Route path="/shows/:showId/seats"    element={<SeatMapPage />} />
                <Route path="/payment"                element={
                  <ProtectedRoute><PaymentPage /></ProtectedRoute>
                } />
                <Route path="/confirmation"           element={
                  <ProtectedRoute><ConfirmationPage /></ProtectedRoute>
                } />
                <Route path="/my-bookings"            element={
                  <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
                } />
                <Route path="/login"                  element={<LoginPage />} />
                <Route path="*"                       element={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-gray-700 mb-4">404</p>
                      <p className="text-gray-400">Page not found</p>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
