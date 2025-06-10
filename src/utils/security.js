import DOMPurify from 'dompurify';
// Sanitize user input
export const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href', 'target']
    });
};
// Validate URLs
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
// Sanitize file names
export const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
};
// Validate file types
export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};
// Rate limiting helper
export class RateLimiter {
    constructor(windowMs = 60000, maxRequests = 100) {
        Object.defineProperty(this, "requests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "windowMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxRequests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }
    isRateLimited(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || [];
        // Remove old requests
        const recentRequests = userRequests.filter(time => now - time < this.windowMs);
        if (recentRequests.length >= this.maxRequests) {
            return true;
        }
        recentRequests.push(now);
        this.requests.set(key, recentRequests);
        return false;
    }
}
// XSS protection for JSON data
export const sanitizeJSON = (data) => {
    if (typeof data === 'string') {
        return sanitizeInput(data);
    }
    if (Array.isArray(data)) {
        return data.map(item => sanitizeJSON(item));
    }
    if (typeof data === 'object' && data !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            sanitized[key] = sanitizeJSON(value);
        }
        return sanitized;
    }
    return data;
};
