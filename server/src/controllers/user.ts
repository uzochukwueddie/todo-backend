import { IUser } from '@/interfaces/user.interface';
import { authMiddleware } from '@/middleware/auth';
import { create, getById } from '@/services/user.service';
import { hashPassword, verifyPassword } from '@/utils/utils';
import { validateSignInUser, validateSignUpUser } from '@/utils/validation';
import { Request, Response } from 'express';

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

      res.status(201).json({ message: 'User created successfully', user: userData });
    } catch (error) {
      throw new Error('Failed to register user.');
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;

      const user = await validateSignInUser(req.body);

      const isPasswordValid = await verifyPassword(password, user.password!);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const accessToken: string = authMiddleware.generateAccessToken(user);
      req.session = { access: accessToken };

      res.status(200).json({ message: 'User login successful', user });
    } catch (error) {
      throw new Error('Failed to login user.');
    }
  }

  public async read(req: Request, res: Response): Promise<void> {
    try {
      const existingUser: IUser | undefined = await getById(req.currentUser!.id);
      if (!existingUser || !Object.keys(existingUser!).length) {
        throw new Error('Invalid user or credentials');
      }
      res.status(200).json({ message: 'Authenticated user', user: existingUser });
    } catch (error) {
      throw new Error('Invalid user or credentials');
    }
  }

  public logout(req: Request, res: Response) {
    try {
      req.session = null;
      req.currentUser = undefined;
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      throw new Error('Failed to logout');
    }
  }
}
