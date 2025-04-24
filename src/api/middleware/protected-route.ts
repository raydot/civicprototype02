import { NextRequest, NextResponse } from 'next/server';
import { AuthenticationError } from '../utils/api-error';

export async function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    roles?: string[];
  } = { requireAuth: true }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Skip auth check if not required
      if (!options.requireAuth) {
        return handler(req);
      }

      const authHeader = req.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing or invalid authorization header');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new AuthenticationError('Missing access token');
      }

      // Verify token and get user info
      try {
        const userResponse = await fetch(`${process.env.AUTH_API_URL}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!userResponse.ok) {
          throw new AuthenticationError('Invalid access token');
        }

        const user = await userResponse.json();

        // Check role requirements if specified
        if (options.roles?.length && !options.roles.some(role => user.roles.includes(role))) {
          throw new AuthenticationError('Insufficient permissions');
        }

        // Add user info to request context
        const requestWithUser = req.clone();
        (requestWithUser as any).user = user;

        return handler(requestWithUser);
      } catch (error) {
        throw new AuthenticationError('Failed to verify access token');
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return new NextResponse(
          JSON.stringify({
            error: error.message,
            code: error.code,
          }),
          {
            status: error.statusCode,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      return new NextResponse(
        JSON.stringify({
          error: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
}
