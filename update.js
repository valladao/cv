const fs = require('fs');
const puppeteer = require('puppeteer');
const MarkdownIt = require('markdown-it');
const { PDFDocument } = require('pdf-lib');

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

  // Gera o PDF inicial
  const tempPath = 'temp-manoel-valladao-cv.pdf';
  await page.pdf({
    path: tempPath,
    format: 'A4',
    margin: {
      top: '1.5cm',
      right: '0.5cm',
      bottom: '1.5cm',
      left: '0.5cm'
    }
  });

  await browser.close();

  // Reabre o PDF para adicionar metadados
  const pdfBytes = fs.readFileSync(tempPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  pdfDoc.setTitle('Manoel Valladão CV');
  pdfDoc.setAuthor('Manoel Valladão');
  pdfDoc.setSubject('Shopify Web Developer Resume');
  pdfDoc.setCreator('Manoel Valladão');
  pdfDoc.setProducer('Generated via Puppeteer + pdf-lib');
  pdfDoc.setCreationDate(new Date());

  const finalPdf = await pdfDoc.save();
  fs.writeFileSync('manoel-valladao-cv.pdf', finalPdf);
  fs.unlinkSync(tempPath); // remove o PDF temporário

  console.log('✔ PDF generated with metadata as manoel-valladao-cv.pdf');
})();
