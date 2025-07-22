import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import HotelsSearch from "../pages/HotelsSearch";
import HotelDetails from "../pages/HotelDetails";
import BookHotel from "../pages/BookHotel";
import MyBookings from "../pages/MyBookings";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hotels" element={<HotelsSearch />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="/book" element={<BookHotel />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
} 