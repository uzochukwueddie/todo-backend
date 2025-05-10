import { Organization } from '@/controllers/organization';
import { authMiddleware } from '@/middleware/auth';
import express, { Router } from 'express';

class OrganizationRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/orgs', authMiddleware.verifyUser, Organization.prototype.getAllOrgs);
    this.router.get('/org/:orgId', authMiddleware.verifyUser, Organization.prototype.getProjectById);
    this.router.post('/org', authMiddleware.verifyUser, Organization.prototype.createOrg);
    this.router.put('/org/:orgId', authMiddleware.verifyUser, Organization.prototype.updateOrg);
    this.router.delete('/org/:orgId', authMiddleware.verifyUser, Organization.prototype.deleteOrganization);

    return this.router;
  }
}

export const organizationRoutes: OrganizationRoutes = new OrganizationRoutes();
