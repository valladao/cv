const fs = require('fs');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');

(async () => {
  const md = new MarkdownIt();
  const markdown = fs.readFileSync('README.md', 'utf-8');
  const html = md.render(markdown);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: sans-serif;
            margin: 2cm;
            line-height: 1.5;
          }
          h1, h2, h3 {
            color: #333;
          }
          code {
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);

  await page.pdf({ path: 'manoel-valladao-cv.pdf', format: 'A4' });

  await browser.close();
  console.log('✔ PDF generated as manoel-valladao-cv.pdf');
})();

