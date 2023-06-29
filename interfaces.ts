export interface IResponse {
  ok: boolean;
  statusCode: number;
  message: string;
  details: any;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  role: number;
}
