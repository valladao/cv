const markdownpdf = require("markdown-pdf");

markdownpdf()
  .from("README.md")
  .to("manoel-valladao-cv.pdf", () => console.log("PDF generated"));
