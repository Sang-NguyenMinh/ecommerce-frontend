'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { authBegin, authFailure, authSuccess } from '../redux/authSlice';
import { AuthAPI } from 'services/AuthAPI';
import { IToken } from 'configs/custom-types';
import {
  getUserBegin,
  getUserFailure,
  getUserSuccess,
} from '../redux/userSlice';
import UserAPI from 'services/UserAPI';

export default function Home() {
  const { phone } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const login = async () => {
      await AuthAPI.logIn('Admin@gmail.com', 'Admin@gmail.com')
        .then(async (resp) => {
          dispatch(authBegin());
          const token: IToken = resp.data;
          console.log('tokennnnnn', resp);
          dispatch(authSuccess({ token }));
          dispatch(getUserBegin());
          const userResp = await UserAPI.getUser();
          dispatch(getUserSuccess(userResp.data));
        })
        .catch(() => {
          dispatch(authFailure());
          dispatch(getUserFailure());
        });
    };
    login();
  }, []);

  const { error } = useAppSelector((state) => state.user);
  console.log(error);
  return (
    <button className="bg-blue-500 text-white text-7xl font-bold px-6 py-3 rounded">
      {phone}
    </button>
  );
}
