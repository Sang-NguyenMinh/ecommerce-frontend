import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { extractResponseError } from "../libs/utils";
import { AppDispatch, RootState } from "./store";
import { IUser } from "configs/custom-types";
import UserAPI from "services/UserAPI";

export interface IUserState extends IUser {
  isLoading: boolean | null;
  error: string | null;
}

const initialState: IUserState = {
  _id: "",
  username: "",
  phone: "",
  avatar: null,
  role: "",
  createdAt: null,
  isLoading: null,
  error: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserBegin(state: IUserState) {
      state.isLoading = true;
    },
    getUserSuccess(state: IUserState, action: PayloadAction<IUser>) {
      console.log(action.payload);
      state.isLoading = false;
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.phone = action.payload.phone;
      state.avatar = action.payload.avatar;
      state.role = action.payload.role;
      state.createdAt = action.payload.createdAt;
    },
    getUserFailure(state: IUserState) {
      state.error = null;
      state.isLoading = false;
    },
    setIsLoading(state: IUserState, { payload }: PayloadAction<boolean>) {
      state.isLoading = payload;
    },
    setError(state: IUserState, { payload }: PayloadAction<string>) {
      state.error = payload;
    },
    clearError(state: IUserState) {
      state.isLoading = false;
      state.error = null;
    },
    clearData(state: IUserState) {
      state._id = "";
      state.username = "";
      state.phone = "";
      state.avatar = null;
      state.role = "";
      state.createdAt = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

const getUser =
  (token?: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const loading = getState().user.isLoading;
      if (loading) return;
      dispatch(getUserBegin());
      const res = await UserAPI.getUser(token);

      const user = res.data as IUser;
      dispatch(getUserSuccess(user));
    } catch (err) {
      dispatch(getUserFailure(extractResponseError(err)));
    }
  };

export const { getUserBegin, getUserSuccess, getUserFailure, clearData } =
  user.actions;
export const userActions = { getUser };
export default user.reducer;
