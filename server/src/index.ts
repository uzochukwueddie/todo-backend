import http from 'http';

import dotenv from 'dotenv';
import express, { json, urlencoded, Request, Response, Application, NextFunction } from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import { envConfig } from './config/env.config';
import { knexInstance } from './database/knexfile';
import { appRoutes } from './routes';
import { CustomError, IErrorResponse } from './utils/error';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const SERVER_PORT = 5000;

class ToDoServer {
  private app: Application;
  private httpServer: http.Server;

  constructor() {
    this.app = express();
    this.httpServer = new http.Server(this.app);
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.errorHandler(this.app);
    this.startHttpServer(this.httpServer);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [envConfig.SECRET_KEY_ONE, envConfig.SECRET_KEY_TWO],
        maxAge: 24 * 7 * 3600000,
        secure: envConfig.NODE_ENV !== 'development',
        ...(envConfig.NODE_ENV !== 'development' && {
          sameSite: 'none'
        }),
        httpOnly: envConfig.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private errorHandler(app: Application): void {
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        console.log('error', error);
        res.status(error.statusCode).json(error.serializeErrors());
      }

      next();
    });
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      console.log(`TODO server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        console.log(`TODO server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      console.log('error', 'TODOService startHttpServer() error method:', error);
    }
  }
}

knexInstance
  .raw('SELECT 1')
  .then(() => {
    console.log('Database connected successfully');
    const server: ToDoServer = new ToDoServer();
    server.start();
  })
  .catch((error) => console.log('Error connecting to PostgreSQL.', error));
