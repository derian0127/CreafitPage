import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function creafitSeoPlugin(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '');
  return {
    name: 'creafit-seo-files',
    closeBundle() {
      const catalogPath = path.join(__dirname, 'src/data/catalog.json');
      const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8')) as {
        products: { id: number }[];
      };
      const paths = [
        '/',
        '/catalog',
        '/checkout',
        '/gracias',
        '/envios-pagos',
        '/autenticidad',
        ...catalog.products.map((p) => `/product/${p.id}`),
      ];
      const outDir = path.resolve(__dirname, 'dist');
      const body = paths
        .map(
          (p) =>
            `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
        )
        .join('\n');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
      writeFileSync(path.join(outDir, 'sitemap.xml'), xml);
      writeFileSync(path.join(outDir, 'robots.txt'), robots);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || 'https://example.com';

  return {
    plugins: [react(), creafitSeoPlugin(siteUrl)],
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
