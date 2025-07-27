import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action)=>{
            state.currentUser = action.payload;
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
        },
        logOut: (state)=>{
            state.currentUser = null;
            localStorage.removeItem("currentUser");
        }
    }
})

export const {setCurrentUser, logOut} = userSlice.actions;
export default userSlice.reducer;