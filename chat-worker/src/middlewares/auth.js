import { INTERNAL_API_KEY } from '../config/env.js';

export async function internalAuthMiddleware(c, next) {
  const secret = c.req.header('x-internal-secret');
  if (secret !== INTERNAL_API_KEY) {
    return c.json({ success: false, error: 'Unauthorized: Invalid Service Secret' }, 401);
  }
  await next();
}
