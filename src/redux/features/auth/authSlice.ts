import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type TAuthState = {
  name: null | string;
  email: null | string;
  role: null | boolean;
  token: null | string;
};

const initialState: TAuthState = {
  name: null,
  email: null,
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, email, token, role } = action.payload;
      state.name = name;
      state.email = email;
      state.role = role;
      state.token = token;
    },
    logOut: (state) => {
      state.email = null;
      state.token = null;
      state.role = null;
      state.name = null;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentUser = (state: RootState) => state.auth;
export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentRole = (state: RootState) => state.auth.role;
