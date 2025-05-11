import { knexInstance } from '@/database/knexfile';
import { IOrganization } from '@/interfaces/organization.interface';

const db = knexInstance;

export function getAll() {
  return db('organizations').select('*');
}

export function getById(id: number) {
  return db('organizations').where({ id }).first();
}

export async function create(orgData: IOrganization) {
  return db.transaction(async (trx) => {
    const [organization] = await trx('organizations')
      .insert({
        name: orgData.name,
        description: orgData.description,
        user_id: orgData.user_id
      })
      .returning('*');

    return organization;
  });
}

export async function update(id: number, orgData: IOrganization) {
  const [organization] = await db('organizations')
    .where({ id })
    .update({
      name: orgData.name,
      description: orgData.description
    })
    .returning('*');

  return organization;
}

export function deleteOrg(id: number) {
  return db('organizations').where({ id }).del().returning('*');
}
