import { Application, Request, Response } from 'express';
import { userRoutes } from './routes/user';
import { authMiddleware } from './middleware/auth';

export const appRoutes = (app: Application) => {
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('TODO service is healthy and OK.');
  });
  app.use('', userRoutes.routes());

  app.use('', authMiddleware.verifyUser, userRoutes.currentUserRoute());
};
