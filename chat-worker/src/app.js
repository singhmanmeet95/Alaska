import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiRoutes from './routes/index.js';

const app = new Hono();

app.use('*', cors());

// Health check
app.get('/health', (c) => c.json({ status: 'Worker OK' }));

// API routes
app.route('/api', apiRoutes);

export default app;
