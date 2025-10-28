const express = require('express');

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
const id = req.params.id;
db.run('DELETE FROM cart WHERE id = ?', [id], function (err) {
if (err) return res.status(500).json({ error: err.message });
if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
res.json({ success: true });
});
});


// PUT /api/cart/:id - update qty
app.put('/api/cart/:id', (req, res) => {
const id = req.params.id;
const { qty } = req.body;
if (!qty || qty < 0) return res.status(400).json({ error: 'Invalid qty' });
db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, id], function (err) {
if (err) return res.status(500).json({ error: err.message });
if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
res.json({ id, qty });
});
});


// POST /api/checkout { cartItems: [{cartId}] , name, email }
app.post('/api/checkout', (req, res) => {
const { cartItems = [], name, email } = req.body;
// fetch cart details
if (!name || !email) return res.status(400).json({ error: 'Name and email required' });


const placeholders = cartItems.map(() => '?').join(',');
const sql = `SELECT c.id as cartId, p.name, p.price, c.qty FROM cart c JOIN products p ON c.productId = p.id WHERE c.id IN (${placeholders})`;
db.all(sql, cartItems, (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
const total = rows.reduce((s, r) => s + r.price * r.qty, 0);
const receipt = { id: uuidv4(), name, email, total, items: rows, timestamp: new Date().toISOString() };


// clear purchased cart items
const delSql = `DELETE FROM cart WHERE id IN (${placeholders})`;
db.run(delSql, cartItems, function (dErr) {
if (dErr) console.error('Failed to clear cart', dErr.message);
res.json({ receipt });
});
});
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


module.exports = app; // for tests