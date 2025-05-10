import { IUser } from '@/interfaces/user.interface';
import knex from 'knex';

export function getAll() {
  return knex('users').select('id', 'email', 'username', 'first_name', 'last_name', 'created_at');
}

export function getById(id: string) {
  return knex('users').where({ id }).select('id', 'email', 'username', 'first_name', 'last_name', 'created_at').first();
}

export function getByEmail(email: string) {
  return knex('users').where({ email }).first();
}

export function getByUsername(username: string) {
  return knex('users').where({ username }).first();
}

export async function create(userData: IUser) {
  const [user] = await knex('users')
    .insert({
      email: userData.email,
      username: userData.username,
      password_hash: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName
    })
    .returning(['id', 'email', 'username', 'first_name', 'last_name', 'created_at']);

  return user;
}

export async function update(id: string, userData: IUser) {
  const [user] = await knex('users')
    .where({ id })
    .update(userData)
    .returning(['id', 'email', 'username', 'first_name', 'last_name', 'created_at']);

  return user;
}

// delete is a reserved keyword
export function deleteUser(id: string) {
  return knex('users').where({ id }).del();
}

// export async function verifyPassword(email: string, password: string) {
//   const user = await knex('users').where({ email }).first();

//   if (!user) return false;

//   const isValid = await bcrypt.compare(password, user.password_hash);

//   if (!isValid) return false;

//   // Return user without password_hash
//   delete user.password_hash;
//   return user;
// }

export function getUserOrganizations(userId: string) {
  return knex('organization_members as om')
    .join('organizations as org', 'om.organization_id', 'org.id')
    .where('om.user_id', userId)
    .select('org.id', 'org.name', 'org.description');
}
