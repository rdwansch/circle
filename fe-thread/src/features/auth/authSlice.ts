import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  id: number;
  username: string;
  full_name: string;
  profile_description: string;
  profile_picture: string;
  isLogin: boolean;
  followers: number;
  following: number;
};

const initialState: AuthState = {
  full_name: "",
  id: 0,
  profile_description: "",
  username: "",
  isLogin: false,
  profile_picture: "",
  followers: 0,
  following: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.full_name = action.payload.full_name;
      state.profile_description = action.payload.profile_description;
      state.profile_picture = action.payload.profile_picture;
      state.followers = action.payload.followers;
      state.following = action.payload.following;
      state.isLogin = true;
    },
    removeSession: state => {
      state.id = 0;
      state.isLogin = false;
      state.full_name = "";
      state.profile_description = "";
      state.username = "";
      state.profile_picture = "";
      state.followers = 0;
      state.following = 0;
    },
  },
});

export const { setSession, removeSession } = authSlice.actions;

export default authSlice.reducer;
