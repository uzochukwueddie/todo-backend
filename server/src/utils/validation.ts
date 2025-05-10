import { IUser } from '@/interfaces/user.interface';
import { getByEmail, getByUsername } from '@/services/user.service';
import { BadRequestError, NotFoundError } from './error';

export async function validateSignUpUser(input: IUser) {
  const { username, email, password, firstName, lastName } = input;

  if (!isEmail(email)) {
    throw new BadRequestError('Invalid email');
  }

  const existingUser = await getByEmail(email);
  if (existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  if (username!.length < 5) {
    throw new BadRequestError('Username must have at least 5 characters.');
  }

  if (!firstName!.length || !lastName!.length) {
    throw new BadRequestError('Firstname or Lastname must not be empty.');
  }

  if (password!.length < 7) {
    throw new BadRequestError('Password must have at least 7 characters.');
  }

  if (!/(?=.*[a-z])(?=.*\d)/.test(password!)) {
    throw new BadRequestError('Password must contain at least one lowercase and one number.');
  }
}

export async function validateSignInUser(input: IUser): Promise<IUser> {
  const { username, password } = input;

  // Check if the username name field is an email or not
  const isValidEmail: boolean = isEmail(username);

  const existingUser: IUser | undefined = !isValidEmail ? await getByUsername(username) : await getByEmail(username);
  if (!existingUser) {
    throw new NotFoundError('Invalid credentials');
  }

  if (password!.length < 7) {
    throw new BadRequestError('Password must have at least 7 characters.');
  }

  if (!/(?=.*[a-z])(?=.*\d)/.test(password!)) {
    throw new BadRequestError('Password must contain at least one lowercase and one number.');
  }

  return existingUser;
}

export function isEmail(email: string): boolean {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
}
