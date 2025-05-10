import { envConfig } from '@/config/env.config';
import { IUser, TokenPayload } from '@/interfaces/user.interface';
import { sign, verify } from 'jsonwebtoken';
import { NextFunction, Request } from 'express';

class AuthMiddleware {
  generateAccessToken(user: IUser) {
    return sign({ id: user.id, email: user.email }, envConfig.JWT_ACCESS_SECRET);
  }

  verifyToken(token: string, secret: string): TokenPayload {
    return verify(token, secret) as TokenPayload;
  }

  verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.access) {
      throw new Error('Please login again.');
    }

    try {
      const payload: TokenPayload = this.verifyToken(req.session?.access, envConfig.JWT_ACCESS_SECRET);
      req.currentUser = payload;
    } catch (error: any) {
      throw new Error('Invalid or expired token');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
