import { User } from '@/controllers/user';
import { authMiddleware } from '@/middleware/auth';
import express, { Router } from 'express';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/signup', User.prototype.create);
    this.router.post('/auth/signin', User.prototype.login);
    this.router.post('/auth/signout', User.prototype.logout);

    return this.router;
  }

  public currentUserRoute(): Router {
    this.router.get('/current-user', authMiddleware.checkAuthentication, User.prototype.read);

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
