/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const token = Cookies.get("token");
const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

const initialState: AuthState = {
  user,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      Cookies.set("token", action.payload.token, {
        secure: true,
        sameSite: "Strict",
        expires: 7,
      });
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
