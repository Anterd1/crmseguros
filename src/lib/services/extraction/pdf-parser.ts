export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
        // Use dynamic require for CommonJS library compatibility
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to parse PDF file');
    }
}
