import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.bookings.push(action.payload);
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  addBooking, 
  setCurrentBooking, 
  clearCurrentBooking, 
  setBookings, 
  setLoading, 
  setError, 
  clearError 
} = bookingSlice.actions;

export default bookingSlice.reducer; 