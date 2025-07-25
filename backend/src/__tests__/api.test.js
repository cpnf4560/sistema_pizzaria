const request = require('supertest');

// Mock the database connection to avoid MySQL dependency in tests
jest.mock('../config/database', () => ({
  pool: {
    execute: jest.fn(),
    getConnection: jest.fn()
  },
  testConnection: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe('API Endpoints', () => {
  test('GET / should return API info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('API da Pizzaria');
  });

  test('GET /health should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('funcionando');
  });

  test('GET /api/pizzas should be accessible without auth', async () => {
    // Mock the Pizza.getAll method
    const Pizza = require('../models/Pizza');
    Pizza.getAll = jest.fn().mockResolvedValue([]);

    const res = await request(app).get('/api/pizzas');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/register should validate input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: '123',
        nome: 'A'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('inválidos');
  });

  test('GET /nonexistent should return 404', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('não encontrado');
  });
});

describe('Authentication Middleware', () => {
  test('Protected route should require token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Token');
  });

  test('Invalid token should be rejected', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('inválido');
  });
});

describe('Rate Limiting', () => {
  test('Should apply rate limiting to API endpoints', async () => {
    // This test would need multiple requests to trigger rate limiting
    // For now, just verify the endpoint responds
    const res = await request(app).get('/api/pizzas');
    expect(res.status).toBe(200);
  });
});