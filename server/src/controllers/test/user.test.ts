import request from 'supertest';
import express from 'express';
import { User } from '../../controllers/user';
import { authMiddleware } from '../../middleware/auth';
import * as userService from '../../services/user.service';
import { StatusCodes } from 'http-status-codes';
import { hashPassword, verifyPassword } from '../../utils/utils';

// Mock dependencies
jest.mock('../../middleware/auth', () => ({
  authMiddleware: {
    generateAccessToken: jest.fn().mockReturnValue('mock-token'),
    verifyUser: jest.fn().mockImplementation((req, res, next) => {
      req.currentUser = { id: 1, email: 'test@example.com' };
      next();
    })
  }
}));

jest.mock('../../services/user.service');
jest.mock('../../utils/validation', () => ({
  validateSignUpUser: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  validateSignInUser: jest.fn().mockImplementation((data) =>
    Promise.resolve({
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      firstName: 'Test',
      lastName: 'User'
    })
  )
}));

jest.mock('../../utils/utils', () => ({
  hashPassword: jest.fn().mockImplementation(() => Promise.resolve('hashed-password')),
  verifyPassword: jest.fn().mockImplementation(() => Promise.resolve(true))
}));

// Mock error classes
jest.mock('../../utils/error', () => ({
  BadRequestError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'BadRequestError';
    }
  },
  ServerError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ServerError';
    }
  },
  NotFoundError: class extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NotFoundError';
    }
  }
}));

describe('User Routes', () => {
  let app: express.Application;
  let mockSession: any = {};
  let userController: User;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    userController = new User();

    // Mock session middleware
    app.use((req: any, res, next) => {
      req.session = mockSession;
      // Add a setter to track session changes
      Object.defineProperty(req, 'session', {
        get: () => mockSession,
        set: (val) => {
          mockSession = val;
        }
      });
      next();
    });

    // Setup routes
    app.post('/auth/signup', userController.create.bind(userController));
    app.post('/auth/signin', userController.login.bind(userController));
    app.post('/auth/signout', userController.logout.bind(userController));
    app.get('/current-user', authMiddleware.verifyUser, userController.read.bind(userController));

    // Reset mocks and session
    jest.clearAllMocks();
    mockSession = {};
  });

  describe('POST /auth/signup', () => {
    const signupData = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
      firstName: 'New',
      lastName: 'User'
    };

    const mockCreatedUser = {
      id: 1,
      email: 'new@example.com',
      username: 'newuser',
      firstName: 'New',
      lastName: 'User',
      created_at: new Date().toISOString()
    };

    beforeEach(() => {
      (userService.create as jest.Mock).mockResolvedValue(mockCreatedUser);
    });

    it('should create a new user and return success response', async () => {
      const response = await request(app).post('/auth/signup').send(signupData).expect(StatusCodes.CREATED);

      expect(response.body).toEqual({
        message: 'User created successfully',
        user: mockCreatedUser
      });

      expect(hashPassword).toHaveBeenCalledWith(signupData.password);
      expect(userService.create).toHaveBeenCalledWith({
        ...signupData,
        password: 'hashed-password'
      });
      expect(authMiddleware.generateAccessToken).toHaveBeenCalledWith(mockCreatedUser);
      expect(mockSession).toEqual({ access: 'mock-token' });
    });

    it('should return error when user creation fails', async () => {
      (userService.create as jest.Mock).mockRejectedValue(new Error('Failed to create user'));

      await request(app).post('/auth/signup').send(signupData).expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /auth/signin', () => {
    const signinData = {
      username: 'test@example.com',
      password: 'password123'
    };

    it('should sign in a user and return success response', async () => {
      const response = await request(app).post('/auth/signin').send(signinData).expect(StatusCodes.OK);

      expect(response.body.message).toBe('User login successful');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');

      expect(authMiddleware.generateAccessToken).toHaveBeenCalled();
      expect(mockSession).toEqual({ access: 'mock-token' });
    });

    it('should return error when password is invalid', async () => {
      (verifyPassword as jest.Mock).mockResolvedValueOnce(false);

      await request(app).post('/auth/signin').send(signinData).expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('POST /auth/signout', () => {
    beforeEach(() => {
      mockSession = { access: 'existing-token' };
    });

    it('should sign out a user and clear session', async () => {
      const response = await request(app).post('/auth/signout').expect(StatusCodes.OK);

      expect(response.body).toEqual({
        message: 'Logout successful'
      });

      // The controller sets session to null
      expect(mockSession).toBe(null);
    });
  });

  describe('GET /current-user', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      created_at: new Date().toISOString()
    };

    beforeEach(() => {
      (userService.getById as jest.Mock).mockResolvedValue(mockUser);
    });

    it('should return the current authenticated user', async () => {
      const response = await request(app).get('/current-user').expect(StatusCodes.OK);

      expect(response.body).toEqual({
        message: 'Authenticated user',
        user: mockUser
      });

      expect(userService.getById).toHaveBeenCalledWith(1);
    });

    it('should return error when user is not found', async () => {
      (userService.getById as jest.Mock).mockResolvedValue(undefined);

      await request(app).get('/current-user').expect(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
