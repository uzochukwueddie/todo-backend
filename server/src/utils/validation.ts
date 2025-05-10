import { IUser } from '@/interfaces/user.interface';
import { getByEmail, getByUsername } from '@/services/user.service';

export async function validateSignUpUser(input: IUser) {
  const { username, email, password } = input;

  if (!isEmail(email)) {
    throw new Error('Invalid email');
  }

  const existingUser = await getByEmail(email);
  if (existingUser) {
    throw new Error('Invalid credentials');
  }

  if (username!.length < 5) {
    throw new Error('Username must have at least 5 characters.');
  }

  if (password!.length < 7) {
    throw new Error('Password must have at least 7 characters.');
  }

  if (!/(?=.*[a-z])(?=.*\d)/.test(password!)) {
    throw new Error('Password must contain at least one lowercase and one number.');
  }
}

export async function validateSignInUser(input: IUser): Promise<IUser> {
  const { username, password } = input;

  // Check if the username name field is an email or not
  const isValidEmail: boolean = isEmail(username);

  const existingUser: IUser | undefined = !isValidEmail ? await getByUsername(username) : await getByEmail(username);
  if (!existingUser) {
    throw new Error('Invalid credentials');
  }

  if (password!.length < 7) {
    throw new Error('Password must have at least 7 characters.');
  }

  if (!/(?=.*[a-z])(?=.*\d)/.test(password!)) {
    throw new Error('Password must contain at least one lowercase and one number.');
  }

  return existingUser;
}

export function isEmail(email: string): boolean {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
}
