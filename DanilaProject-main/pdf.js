import fs from 'fs';
import PDFDocument from 'pdfkit';

// create a document
const doc = new PDFDocument();

// pipe the document to a file
const stream = fs.createWriteStream('output.pdf');

doc.pipe(stream);

// add your content to the document here, as usual
doc
  .fontSize(25)
  .text('Some text with an embedded font!', 100, 100);

// finalize the PDF and end the stream
doc.end();
stream.on('finish', function() {
  console.log('PDF has been written to output.pdf');
});