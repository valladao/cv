const fs = require('fs');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');

(async () => {
  const md = new MarkdownIt({ html: true });
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
          .page-break {
            page-break-before: always;
            break-before: page;
            display: block;
            height: 0;
          }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);

  await page.pdf({
    path: 'manoel-valladao-cv.pdf',
    format: 'A4',
    margin: {
        top: '1.5cm',
        right: '0.5cm',
        bottom: '1.5cm',
        left: '0.5cm'
    }
  });

  await browser.close();
  console.log('✔ PDF generated as manoel-valladao-cv.pdf');
})();
