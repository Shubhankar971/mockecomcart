const request = require('supertest');
const app = require('../server');


describe('API Smoke', () => {
it('GET /api/products', async () => {
const res = await request(app).get('/api/products');
expect(res.statusCode).toBe(200);
expect(Array.isArray(res.body)).toBe(true);
});


it('Cart flow', async () => {
const products = (await request(app).get('/api/products')).body;
const productId = products[0].id;
// add
const add = await request(app).post('/api/cart').send({ productId, qty: 2 });
expect(add.statusCode).toBe(201);
// get cart
const cart = await request(app).get('/api/cart');
expect(cart.statusCode).toBe(200);
expect(cart.body.total).toBeGreaterThan(0);
// delete
const cartId = cart.body.items[0].cartId;
const del = await request(app).delete(`/api/cart/${cartId}`);
expect(del.statusCode).toBe(200);
});
});