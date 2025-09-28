import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import fs from 'node:fs';
import { URL, fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const createExpressApp = async () => {
  const app = express();
  const port = 5173;

  const vite = await createServer({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.js', '.ts', '.json', '.jsx', '.tsx'],
    },
    envPrefix: 'APP_',
    appType: 'custom',
    server: {
      middlewareMode: true,
      host: false,
      port: 5173,
      strictPort: true,
      open: false,
    },
  });

  app.use(vite.middlewares);

  app.get('/', async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const statusCode = 200;

      let html = fs.readFileSync('index.html', 'utf-8');

      html = await vite.transformIndexHtml(url, html);

      res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.get('/api/rest', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Данные получены через Express API-middleware',
      timestamp: new Date().toISOString(),
    });
  });

  const suggestions = [
    { id: 1, title: 'Warcraft' },
    { id: 2, title: 'Age of Empires' },
    { id: 3, title: 'Dawn of War' },
    { id: 4, title: 'Red Alert' },
    { id: 5, title: 'StarCraft' },
    { id: 6, title: 'Command & Conquer' },
  ];

  app.get('/api/rest/suggestions', async (req, res) => {
    const searchQuery = req.query.search;

    let results = suggestions;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      results = suggestions.filter((item) =>
        item.title.toLowerCase().includes(lowerCaseQuery),
      );
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        /* eslint-disable-next-line no-magic-numbers */
      }, Date.now() % 1000);
    });

    res.json({
      data: results,
      count: results.length,
      query: searchQuery || null,
    });
  });

  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server running at http://localhost:${port}`);
  });
};

createExpressApp();
