declare global {
  namespace Express {
    interface Request {
      currentUser?: TokenPayload;
    }
  }
}

export interface IUser {
  id?: string;
  email: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface TokenPayload {
  id: string;
  email: string;
}
