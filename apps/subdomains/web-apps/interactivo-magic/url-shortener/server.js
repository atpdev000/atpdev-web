const express = require('express');
const cors = require('cors');
const db = require('./db');
const { generateShortCode } = require('./utils/codeGenerator');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * REDIRECT: GET /:code
 * Resolves short code and redirects to long URL instantly
 */
app.get('/:code', (req, res) => {
    const { code } = req.params;

    db.get('SELECT long_url FROM urls WHERE short_code = ?', [code], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (row) {
            // Increment clicks asynchronously
            db.run('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?', [code]);

            // Redirect 301 (Permanent)
            return res.redirect(301, row.long_url);
        } else {
            return res.status(404).send('URL Not Found');
        }
    });
});

/**
 * API: POST /api/shorten
 * Shortens a long URL and returns the short code
 */
app.post('/api/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Check if same URL already shortened (optional but good for DB size)
    db.get('SELECT short_code FROM urls WHERE long_url = ?', [url], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (row) {
            return res.json({
                success: true,
                shortCode: row.short_code,
                shortUrl: `${req.protocol}://${req.get('host')}/${row.short_code}`
            });
        }

        // Generate new code
        const shortCode = generateShortCode();

        db.run('INSERT INTO urls (short_code, long_url) VALUES (?, ?)', [shortCode, url], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to create short URL' });
            }

            res.json({
                success: true,
                shortCode: shortCode,
                shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`URL Shortener server running at http://localhost:${PORT}`);
});
