import { IProject } from '@/interfaces/project.interface';
import {
  createProject,
  deleteProject,
  getAll,
  getById,
  getByOrganization,
  updateProject
} from '@/services/project.service';
import { ServerError } from '@/utils/error';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class Project {
  public async getAllProjects(_req: Request, res: Response): Promise<void> {
    try {
      const projects: IProject[] = await getAll();
      res.status(StatusCodes.OK).json({ message: 'All projects', projects });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async getProjectByOrganization(req: Request, res: Response): Promise<void> {
    try {
      const projects: IProject[] = await getByOrganization(req.params.organizationId);
      res.status(StatusCodes.OK).json({ message: 'Projects by org. ID', projects });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }
  public async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const project: IProject = await getById(parseInt(req.params.projectId));
      res.status(StatusCodes.OK).json({ message: 'Single project', project });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const project: IProject = await createProject({
        ...req.body,
        user_id: req.currentUser?.id
      });

      res.status(StatusCodes.CREATED).json({ message: 'Project created successfully', project });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const project: IProject = await updateProject(projectId, {
        ...req.body,
        user_id: req.currentUser?.id
      });

      res.status(StatusCodes.OK).json({ message: 'Project updated successfully', project });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { todoId } = req.params;
      const project: IProject = await deleteProject(todoId);
      res.status(StatusCodes.OK).json({ message: 'Project deleted successfully', project });
    } catch (error: any) {
      throw new ServerError(error?.message);
    }
  }
}
