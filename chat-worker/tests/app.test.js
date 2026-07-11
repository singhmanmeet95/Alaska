import { describe, it, expect, vi } from 'vitest';
import app from '../src/app.js';

// Mock dependencies
vi.mock('../src/config/redis.js', () => ({
  pubClient: {
    publish: vi.fn(),
    duplicate: vi.fn(),
    connect: vi.fn(),
  },
  queueClient: {
    brPop: vi.fn(),
    connect: vi.fn(),
  },
  connectRedis: vi.fn(),
}));

vi.mock('../models/Chat.js', () => {
  return {
    Chat: {
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockResolvedValue([{ senderId: '1', receiverId: '2', message: 'hello' }]),
      })
    }
  };
});

describe('App Endpoints', () => {
  it('GET /health should return status OK', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'Worker OK' });
  });

  it('GET /api/chats/between/:senderId/:receiverId should return chats', async () => {
    const res = await app.request('/api/chats/between/1/2');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].message).toBe('hello');
  });

  it('POST /api/messages without auth should fail', async () => {
    const res = await app.request('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId: '1', receiverId: '2', message: 'test' }),
    });
    expect(res.status).toBe(401);
  });
});
