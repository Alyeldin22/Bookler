import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
export default configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer
  }
}); 