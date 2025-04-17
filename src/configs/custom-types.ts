export interface IToken {
  type: string;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  userId: string | null;
  username: string | null;
  role: string | null;

  iat: number | null;
  exp: number | null;
}

export interface IUser {
  _id: string;
  username: string;
  phone: string;
  avatar: string | null;
  role: string;
  createdAt: Date | null;
}
