import { app } from './api-server.js';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Serve static assets in production from /dist
const distPath = path.resolve('./dist');
if (fsExists(distPath)) {
  console.log(`[AI Studio] Production build folder found at ${distPath}. Serving static files.`);
  app.use(express.static(distPath));
  
  // SPA fallback: Route all non-API GET requests to index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.log('[AI Studio] Running API server in development mode. Static files will be served by Vite dev server.');
}

// Helper to avoid top-level import fs issues
import fs from 'fs';
function fsExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AI Studio] Server is running and listening at http://0.0.0.0:${PORT}`);
});
