import { envConfig } from '@/config/env.config';
import { IUser, TokenPayload } from '@/interfaces/user.interface';
import { sign, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError, ServerError } from '@/utils/error';

class AuthMiddleware {
  generateAccessToken(user: IUser) {
    return sign({ id: user.id, email: user.email }, envConfig.JWT_ACCESS_SECRET, { expiresIn: '7d' });
  }

  verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.access) {
      throw new BadRequestError('Please login again.');
    }

    try {
      const payload: TokenPayload = verify(req.session?.access, envConfig.JWT_ACCESS_SECRET) as TokenPayload;
      req.currentUser = payload;
    } catch (error: any) {
      throw new ServerError('Invalid or expired token');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
