import { knexInstance } from '@/database/knexfile';
import { IProject } from '@/interfaces/project.interface';

const db = knexInstance;

export function getAll() {
  return db('projects').select('*');
}

export function getByOrganization(organizationId: string) {
  return db('projects').where({ organization_id: organizationId }).select('*');
}

export function getById(id: number) {
  return db('projects').where({ id }).first();
}

export async function createProject(projectData: IProject) {
  const [project] = await db('projects')
    .insert({
      name: projectData.name,
      description: projectData.description,
      organization_id: projectData.organization_id,
      user_id: projectData.user_id
    })
    .returning('*');

  return project;
}

export async function updateProject(id: string, projectData: IProject) {
  const [project] = await db('projects')
    .where({ id })
    .update({
      name: projectData.name,
      description: projectData.description
    })
    .returning('*');

  return project;
}

// Delete a project
export function deleteProject(id: number) {
  return db('projects').where({ id }).del().select('*');
}
