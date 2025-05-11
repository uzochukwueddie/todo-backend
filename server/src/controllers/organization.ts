import { IOrganization } from '@/interfaces/organization.interface';
import { create, deleteOrg, getAll, getById, update } from '@/services/organization';
import { ServerError } from '@/utils/error';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Organization {
  public async getAllOrgs(_req: Request, res: Response): Promise<void> {
    try {
      const organizations: IOrganization[] = await getAll();
      res.status(StatusCodes.OK).json({ message: 'All organizations', organizations });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const organization: IOrganization = await getById(parseInt(req.params.orgId));
      res.status(StatusCodes.OK).json({ message: 'Single organization', organization });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async createOrg(req: Request, res: Response): Promise<void> {
    try {
      const organization: IOrganization = await create({
        ...req.body,
        user_id: req.currentUser?.id
      });

      res.status(StatusCodes.CREATED).json({ message: 'Organization created successfully', organization });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async updateOrg(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params;
      const organization: IOrganization = await update(parseInt(orgId), {
        ...req.body,
        user_id: req.currentUser?.id
      });

      res.status(StatusCodes.OK).json({ message: 'Organization updated successfully', organization });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async deleteOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { orgId } = req.params;
      const organization = await deleteOrg(parseInt(orgId));
      res.status(StatusCodes.OK).json({ message: 'Organization deleted successfully', organization });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }
}
