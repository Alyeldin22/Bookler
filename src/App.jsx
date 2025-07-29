import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import SignUpPage from './pages/SignUp/SignUp';
import HotelsSearchPage from './pages/HotelsSearch/HotelsSearch';
import HotelDetailsPage from './pages/HotelDetails/HotelDetails';
import BookHotelPage from './pages/BookHotel/BookHotel';
import MyBookingsPage from './pages/MyBookings/MyBookings';
import ApiTester from './components/ApiTester/ApiTester';
import TailwindTest from './components/TailwindTest/TailwindTest';
import SystemTest from './components/SystemTest/SystemTest';
import NotFoundPage from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import QuickNavigation from './components/QuickNavigation/QuickNavigation';

function BookingApp() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></span></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />}/>
          <Route path="signup" element={<SignUpPage />}/>
          <Route path="hotelssearch" element={<HotelsSearchPage />}/>
          <Route path="/hotelssearch/:id" element={<HotelDetailsPage />}/>
          <Route path="book-hotel/:id" element={<ProtectedRoute><BookHotelPage /></ProtectedRoute>}/>
          <Route path="my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}/>
          <Route path="api-test" element={<ApiTester />}/>
          <Route path="tailwind-test" element={<TailwindTest />}/>
          <Route path="system-test" element={<SystemTest />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <QuickNavigation />
    </div>
  )
}
export default BookingApp
