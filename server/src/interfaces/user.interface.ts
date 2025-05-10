declare global {
  namespace Express {
    interface Request {
      currentUser?: TokenPayload;
    }
  }
}

export interface IUser {
  id?: number;
  email: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  created_at?: Date;
}

export interface TokenPayload {
  id: number;
  email: string;
}
