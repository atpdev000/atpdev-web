const crypto = require('crypto');

/**
 * Generates a short code using base62-like characters
 * @returns {string} - A 6-character short code
 */
function generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    // Use crypto for better randomness
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return code;
}

module.exports = { generateShortCode };
