import { Project } from '@/controllers/project';
import { Todo } from '@/controllers/todo';
import { authMiddleware } from '@/middleware/auth';
import express, { Router } from 'express';

class ProjectRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/projects', authMiddleware.verifyUser, Project.prototype.getAllProjects);
    this.router.get('/project/:projectId', authMiddleware.verifyUser, Project.prototype.getProjectById);
    this.router.get('/project/:organizationId', authMiddleware.verifyUser, Project.prototype.getProjectByOrganization);
    this.router.post('/project', authMiddleware.verifyUser, Project.prototype.create);
    this.router.put('/project/:projectId', authMiddleware.verifyUser, Project.prototype.update);
    this.router.delete('/project/:projectId', authMiddleware.verifyUser, Project.prototype.delete);

    return this.router;
  }
}

export const projectRoutes: ProjectRoutes = new ProjectRoutes();
