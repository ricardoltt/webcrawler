class LoggerMiddleware {
  logRequest(req, res, next) {
    const start = Date.now();
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    if (req.method === 'POST' && Object.keys(req.body).length) {
      console.log('Request body:', JSON.stringify(req.body));
    }
    
    const originalSend = res.send;
    res.send = function(body) {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
      return originalSend.call(this, body);
    };
    
    next();
  }
}

module.exports = new LoggerMiddleware(); 