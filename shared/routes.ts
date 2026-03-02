import { z } from 'zod';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), username: z.string(), fullName: z.string(), profilePicture: z.string().nullable() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/me' as const,
      responses: {
        200: z.object({ id: z.number(), username: z.string(), fullName: z.string(), profilePicture: z.string().nullable() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  accounts: {
    get: {
      method: 'GET' as const,
      path: '/api/account' as const,
      responses: {
        200: z.object({
          id: z.number(),
          accountNumber: z.string(),
          balance: z.string(),
          isBlocked: z.boolean(),
          cardNumber: z.string().nullable()
        }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  transfers: {
    create: {
      method: 'POST' as const,
      path: '/api/transfers' as const,
      input: z.object({
        iban: z.string(),
        bic: z.string(),
        amount: z.string()
      }),
      responses: {
        200: z.object({
          id: z.number(),
          status: z.string(),
          message: z.string()
        }),
        400: errorSchemas.validation,
        403: errorSchemas.forbidden,
      }
    }
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications' as const,
      responses: {
        200: z.array(z.object({
          id: z.number(),
          message: z.string(),
          isRead: z.boolean()
        }))
      }
    },
    markRead: {
      method: 'POST' as const,
      path: '/api/notifications/read' as const,
      responses: {
        200: z.object({ success: z.boolean() })
      }
    }
  },
  profile: {
    updatePicture: {
      method: 'POST' as const,
      path: '/api/profile/picture' as const,
      input: z.object({ profilePicture: z.string() }),
      responses: {
        200: z.object({ success: z.boolean(), profilePicture: z.string() })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
