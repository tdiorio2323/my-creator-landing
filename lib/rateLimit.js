// Simple in-memory rate limiter
const rateLimitMap = new Map()

export function rateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests, please try again later.'
  } = options

  return function rateLimitMiddleware(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown'
    
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Get or create tracking for this IP
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, [])
    }
    
    const requests = rateLimitMap.get(ip)
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => time > windowStart)
    
    if (recentRequests.length >= max) {
      return res.status(429).json({ 
        error: message,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      })
    }
    
    // Add current request
    recentRequests.push(now)
    rateLimitMap.set(ip, recentRequests)
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) { // 1% chance
      for (const [key, value] of rateLimitMap.entries()) {
        const filtered = value.filter(time => time > windowStart)
        if (filtered.length === 0) {
          rateLimitMap.delete(key)
        } else {
          rateLimitMap.set(key, filtered)
        }
      }
    }
    
    if (typeof next === 'function') {
      next()
    }
  }
}

// Express-style middleware wrapper for Next.js
export function withRateLimit(handler, options = {}) {
  const limiter = rateLimit(options)
  
  return async (req, res) => {
    return new Promise((resolve, reject) => {
      limiter(req, res, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(handler(req, res))
        }
      })
    })
  }
}