import { IUser } from '@/interfaces/user.interface';
import { authMiddleware } from '@/middleware/auth';
import { create, getById } from '@/services/user.service';
import { BadRequestError, ServerError } from '@/utils/error';
import { hashPassword, verifyPassword } from '@/utils/utils';
import { validateSignInUser, validateSignUpUser } from '@/utils/validation';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

export class User {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;

      await validateSignUpUser(req.body);

      const hashedPassword: string = await hashPassword(password);
      const user: IUser = {
        ...req.body,
        password: hashedPassword
      };
      const userData = await create(user);
      const accessToken: string = authMiddleware.generateAccessToken(userData);
      req.session = { access: accessToken };

      res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: userData });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;

      const user = await validateSignInUser(req.body);

      const isPasswordValid = await verifyPassword(password, user.password!);
      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials');
      }

      const accessToken: string = authMiddleware.generateAccessToken(user);
      req.session = { access: accessToken };

      const updatedUser = omit(user, ['password']);

      res.status(StatusCodes.OK).json({ message: 'User login successful', user: updatedUser });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async read(req: Request, res: Response): Promise<void> {
    try {
      const existingUser: IUser | undefined = await getById(req.currentUser!.id);
      if (!existingUser || !Object.keys(existingUser!).length) {
        throw new BadRequestError('Invalid user or credentials');
      }
      res.status(StatusCodes.OK).json({ message: 'Authenticated user', user: existingUser });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public logout(req: Request, res: Response) {
    try {
      req.session = null;
      req.currentUser = undefined;
      res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    } catch (error: any) {
      throw new ServerError('Failed to logout');
    }
  }
}
