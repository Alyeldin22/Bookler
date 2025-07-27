import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './utils/apiTestRunner'; // Import to make API test utilities available globally
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import QuickNavigation from './components/QuickNavigation/QuickNavigation';

function BookingApp() {
  const HomePage = lazy(() => import("./pages/Home/Home"));
  const LoginPage = lazy(()=> import("./pages/Login/Login"));
  const SignUpPage = lazy(()=> import("./pages/SignUp/SignUp"));
  const HotelsSearchPage = lazy(()=> import("./pages/HotelsSearch/HotelsSearch"));
  const HotelDetailsPage = lazy(()=> import("./pages/HotelDetails/HotelDetails"));
  const BookHotelPage = lazy(() => import("./pages/BookHotel/BookHotel"));
  const MyBookingsPage = lazy(() => import("./pages/MyBookings/MyBookings"));
  const NotFoundPage = lazy(() => import("./pages/NotFound/NotFound"));
  const ApiTester = lazy(() => import("./components/ApiTester/ApiTester"));
  const TailwindTest = lazy(() => import("./components/TailwindTest/TailwindTest"));
  const SystemTest = lazy(() => import("./components/SystemTest/SystemTest"));
  
  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />}/>
          <Route path="signup" element={<SignUpPage />}/>
          <Route path="hotelssearch" element={<HotelsSearchPage />}/>
          <Route path="/hotelssearch/:id" element={<HotelDetailsPage />}/>
          
          {/* Protected Routes */}
          <Route path="book-hotel/:id" element={
            <ProtectedRoute>
              <BookHotelPage />
            </ProtectedRoute>
          }/>
          <Route path="my-bookings" element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }/>
          
          {/* Test Routes */}
          <Route path="api-test" element={<ApiTester />}/>
          <Route path="tailwind-test" element={<TailwindTest />}/>
          <Route path="system-test" element={<SystemTest />}/>
          
          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <QuickNavigation />
    </>
  )
}

export default BookingApp
