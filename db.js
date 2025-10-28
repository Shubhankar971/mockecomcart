const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbFile);


// initialize tables + seed
db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS products (
id TEXT PRIMARY KEY,
name TEXT,
price REAL
)`);


db.run(`CREATE TABLE IF NOT EXISTS cart (
id TEXT PRIMARY KEY,
productId TEXT,
qty INTEGER
)`);


// seed products if empty
db.get('SELECT COUNT(*) as c FROM products', (err, row) => {
if (err) return console.error(err);
if (row.c === 0) {
const { v4: uuidv4 } = require('uuid');
const items = [
{ name: 'Vintage Tee', price: 19.99 },
{ name: 'Denim Jacket', price: 59.99 },
{ name: 'Sneaker X', price: 89.99 },
{ name: 'Beanie', price: 12.5 },
{ name: 'Sunglasses', price: 24.0 },
{ name: 'Leather Wallet', price: 34.75 }
];
const stmt = db.prepare('INSERT INTO products(id,name,price) VALUES(?,?,?)');
items.forEach(it => stmt.run(uuidv4(), it.name, it.price));
stmt.finalize();
console.log('Seeded products');
}
});
});


module.exports = db;