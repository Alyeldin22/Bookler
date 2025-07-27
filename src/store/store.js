import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import bookingReducer from "./BookingSlice";

export const Store = configureStore({
    reducer: {
        user: userReducer,
        booking: bookingReducer
    }
})