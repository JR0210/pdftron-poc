const { PDFNet } = require("@pdftron/pdfnet-node");

// Errors on call:
// Module not found: Can't resolve './addon' in 'D:\Work\apryse-13-test\node_modules\@pdftron\pdfnet-node\lib'

async function savePDFDocToBuffer(pdfDoc, PDFNet) {
  const pdfBuffer = await pdfDoc.saveMemoryBuffer(
    PDFNet.SDFDoc.SaveOptions.e_linearized
  );
  return pdfBuffer;
}

export async function GET() {
  await PDFNet.initialize(process.env.APRYSE_KEY);
  const main = async () => {
    const doc = await PDFNet.PDFDoc.create();
    const page = await doc.pageCreate();
    doc.pagePushBack(page);
    doc.save("blank.pdf", PDFNet.SDFDoc.SaveOptions.e_linearized);
    const pdfBuffer = await savePDFDocToBuffer(doc);

    const pdfBase64 = pdfBuffer.toString("base64");
    const dataUri = `data:application/pdf;base64,${pdfBase64}`;

    return new Response(dataUri, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="blank.pdf"',
      },
    });
  };

  try {
    await main();
  } catch (error) {
    console.error(error);
  }
}

// Terminate PDFNet after all requests have been handled
// process.on("exit", () => {
//   PDFNet.terminate();
// });
