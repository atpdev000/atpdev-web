const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code TEXT UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      clicks INTEGER DEFAULT 0
    )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('URLs table ready.');
                db.run('CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code)');
            }
        });
    }
});

module.exports = db;
