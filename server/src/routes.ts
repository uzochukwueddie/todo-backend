import { Application, Request, Response } from 'express';
import { userRoutes } from './routes/user';
import { todoRoutes } from './routes/todo';
import { StatusCodes } from 'http-status-codes';
import { projectRoutes } from './routes/project';
import { organizationRoutes } from './routes/organization';

const BASE_URL = '/api';

export const appRoutes = (app: Application) => {
  app.get('/health', (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('TODO service is healthy and OK.');
  });

  app.use(BASE_URL, userRoutes.routes());
  app.use(BASE_URL, userRoutes.currentUserRoute());
  app.use(BASE_URL, todoRoutes.routes());
  app.use(BASE_URL, projectRoutes.routes());
  app.use(BASE_URL, organizationRoutes.routes());
};
