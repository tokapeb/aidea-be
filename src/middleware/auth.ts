import { Response, Request, NextFunction } from 'express';
import asyncHandler from './async';
import ErrorResponse from '../utils/errorResponse';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import AWS from 'aws-sdk';

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      const bearerToken: string = authHeader.split(' ')[1];

      // Verifier that expects valid access tokens:
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.AWS_USER_POOL_ID || '',
        tokenUse: 'access',
        clientId: process.env.AWS_CLIENT_ID,
      });

      try {
        // @ts-ignore
        const payload = await verifier.verify(bearerToken);

        const cognito = new AWS.CognitoIdentityServiceProvider({
          apiVersion: '2016-04-18',
          region: process.env.AWS_REGION,
        });

        const params = {
          AccessToken: bearerToken,
        };

        cognito.getUser(params, function (err, data) {
          if (err) {
            return next(new ErrorResponse(err.message, 500));
          } else {
            next();
          }
        });
      } catch (err) {
        return res.status(401).json({ success: false, message: err });
      }
    } else {
      return next(new ErrorResponse('No Access token', 401));
    }
  }
);
