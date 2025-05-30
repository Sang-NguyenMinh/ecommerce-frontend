'use client';

import { Button, Input, Form, Divider, Image } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthAPI } from 'services/AuthAPI';
import { useAppDispatch } from '@/redux/store';
import { authBegin, authFailure, authSuccess } from '@/redux/authSlice';
import { IToken } from 'configs/custom-types';
import {
  getUserBegin,
  getUserFailure,
  getUserSuccess,
} from '@/redux/userSlice';
import UserAPI from 'services/UserAPI';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onFinish = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await AuthAPI.logIn(email, password)
      .then(async (resp) => {
        dispatch(authBegin());
        const token: IToken = resp.data;
        dispatch(authSuccess({ token }));
        dispatch(getUserBegin());

        const userResp = await UserAPI.getUser();
        dispatch(getUserSuccess(userResp.data));

        router.push('/');
      })
      .catch((err) => {
        console.error('Login failed:', err);
        dispatch(authFailure());
        dispatch(getUserFailure());
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng Nhập</h2>
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email của bạn!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password size="large" placeholder="Mật khẩu" />
          </Form.Item>

          <div className="text-right mb-3">
            <Link
              href="/auth/forgot-password"
              className="text-blue-500 text-sm"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Form.Item>
            <Button
              className="w-full"
              size="large"
              type="primary"
              htmlType="submit"
              // loading={loading}
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
        <Divider className="!text-xs" plain>
          Or Login With
        </Divider>
        <div className="flex justify-around items-center">
          <Button size="large" className="w-[40%] ">
            <Image
              className="!w-5 px-1"
              src="/statics/gg_icon.webp"
              alt="gg icon"
            />
            Google
          </Button>
          <Button size="large" className="w-[40%]" type="default">
            <Image
              className="!w-7 px-1"
              src="/statics/fb_icon.webp"
              alt="gg icon"
            />
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
