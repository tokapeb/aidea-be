import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import AWS from 'aws-sdk';

// @desc    Ping the auth API server
// @route   POST /api/v1/auth/test
// @access  Public / Private
export const authTest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const user = {
      email,
      password,
      formObj: true,
    };

    return res.status(200).json({ success: true, user });
  }
);

// @desc    Sign Up user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const cognito = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: process.env.AWS_REGION,
    });

    const params = {
      ClientId: process.env.AWS_CLIENT_ID || '',
      Password: password,
      Username: email,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    cognito.signUp(params, function (err, data) {
      if (err) {
        console.log('Error in signup: ', err);
        return next(new ErrorResponse(err.message, 500));
      } else {
        return res.status(200).json({
          success: true,
          data: data,
        });
      }
    });
  }
);

// @desc    Sign in user
// @route   POST /api/v1/auth/signin
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const cognito = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: process.env.AWS_REGION,
    });

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.AWS_CLIENT_ID || '',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    cognito.initiateAuth(params, function (err, data) {
      if (err) {
        console.log('Error in signup: ', err);
        return next(new ErrorResponse(err.message, 500));
      } else {
        return res.status(200).json({
          success: true,
          data: data,
        });
      }
    });
  }
);

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;
    const { AccessToken } = req.body;

    let token;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (AccessToken) {
      token = AccessToken;
    }

    if (typeof token === 'string') {
      const cognito = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18',
        region: process.env.AWS_REGION,
      });

      const params = {
        AccessToken: token,
      };

      cognito.globalSignOut(params, function (err, data) {
        if (err) {
          console.log('Error in logout: ', err);
          return next(new ErrorResponse(err.message, 500));
        } else {
          return res.status(200).json({
            success: true,
          });
        }
      });
    } else {
      return next(new ErrorResponse('No Access Token', 400));
    }
  }
);

// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      const AccessToken = authHeader.split(' ')[1];

      const cognito = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18',
        region: process.env.AWS_REGION,
      });

      cognito.getUser({ AccessToken }, function (err, data) {
        if (err) {
          return next(new ErrorResponse(err.message, 500));
        } else {
          res.status(200).json({
            success: true,
            data,
          });
        }
      });
    } else {
      return next(
        new ErrorResponse('Authentication error: Access Token is missing.', 400)
      );
    }
  }
);

// @desc    Trigger forget password workflow !! Later
// @route   POST /api/v1/auth/forgot
// @access  Public

// @desc    Change password
// @route   POST /api/v1/auth/changepassword !! Later
// @access  Private
