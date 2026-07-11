import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../index.js';

describe('Health Endpoint', () => {
  it('should return 200 and health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'health endpoint is working fine');
  });
});
