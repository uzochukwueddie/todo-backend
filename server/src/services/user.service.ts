import { knexInstance } from '@/database/knexfile';
import { IUser } from '@/interfaces/user.interface';

const db = knexInstance;

export function getAll() {
  return db('users').select('id', 'email', 'username', 'firstName', 'lastName', 'created_at');
}

export function getById(id: number) {
  return db('users').where({ id }).select('id', 'email', 'username', 'firstName', 'lastName', 'created_at').first();
}

export function getByEmail(email: string) {
  return db('users').where({ email }).first();
}

export function getByUsername(username: string) {
  return db('users').where({ username }).first();
}

export async function create(userData: IUser): Promise<IUser> {
  const [user] = await db('users')
    .insert({
      email: userData.email,
      username: userData.username,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    })
    .returning(['id', 'email', 'username', 'firstName', 'lastName', 'created_at']);

  return user;
}

export async function update(id: string, userData: IUser): Promise<IUser> {
  const [user] = await db('users')
    .where({ id })
    .update(userData)
    .returning(['id', 'email', 'username', 'firstName', 'lastName', 'created_at']);

  return user;
}

// delete is a reserved keyword
export function deleteUser(id: string) {
  return db('users').where({ id }).del();
}

export function getUserOrganizations(userId: string) {
  return db('organization_members as om')
    .join('organizations as org', 'om.organization_id', 'org.id')
    .where('om.user_id', userId)
    .select('org.id', 'org.name', 'org.description');
}
