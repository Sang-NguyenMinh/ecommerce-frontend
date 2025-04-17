import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppDispatch, AppThunk, RootState } from "./store";
import { IToken, ITokenPayload } from "configs/custom-types";
import { Storage } from "libs/storage";
import { getUserBegin, getUserFailure, getUserSuccess } from "./userSlice";
import UserAPI from "services/UserAPI";
import { extractResponseError } from "libs/utils";

export interface IAuthState {
  isLoggedIn: boolean;
  isLoading: boolean;

  userId: string | null;
  username: string | null;
  role: string | null;

  iat: number | null;
  exp: number | null;

  [key: string]: any;
}

export interface IAccessToken extends ITokenPayload {
  [key: string]: any;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  isLoading: false,

  userId: null,
  username: null,
  role: null,

  iat: null,
  exp: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authBegin(state: IAuthState) {
      state.isLoading = true;
    },
    authSuccess(state: IAuthState, action: PayloadAction<{ token: IToken }>) {
      const { token } = action.payload;
      const tokenParts = token.accessToken.split(".");
      if (tokenParts.length !== 3) throw new Error("Invalid token!");

      const tokenData: IAccessToken = JSON.parse(
        Buffer.from(tokenParts[1], "base64").toString("utf-8")
      );

      state.isLoading = false;
      state.isLoggedIn = true;

      for (const key in tokenData) state[key] = tokenData[key];

      Storage.Cookie.set("token", token, 365);
    },
    authFailure(state: IAuthState) {
      state.isLoggedIn = false;
      state.isLoading = false;

      state.userId = null;
      state.role = null;
      state.username = null;

      state.iat = null;
      state.exp = null;
    },
  },
});

const logIn = (): AppThunk => async (dispatch, getState) => {
  const { isLoading } = getState().auth;

  if (isLoading) return;

  const token = Storage.Cookie.get<IToken>("token");

  if (!!token) {
    try {
      dispatch(auth.actions.authSuccess({ token }));

      dispatch(getUserBegin());
      const response = await UserAPI.getUser(
        [token.type, token.accessToken].join(" ")
      );
      dispatch(getUserSuccess(response.data));
    } catch (err) {
      console.log(extractResponseError(err));
      dispatch(getUserFailure());
    }
  } else {
    dispatch(auth.actions.authFailure());
  }
};

const logOut = () => async (dispatch: AppDispatch) => {
  Storage.Cookie.remove("token");
  dispatch(getUserFailure());
  dispatch(authFailure());
};

export const { authSuccess, authFailure, authBegin } = auth.actions;
export const authActions = { logOut, logIn };
export default auth.reducer;
