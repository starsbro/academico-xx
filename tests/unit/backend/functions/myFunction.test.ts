// Mock pdfjs-dist and genkit before importing the function under test
jest.mock('pdfjs-dist/legacy/build/pdf.js', () => ({
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: jest.fn(() => Promise.resolve({
        getTextContent: jest.fn(() => Promise.resolve({
          items: [{ str: 'Hello PDF' }],
        })),
      })),
    }),
  })),
}));

jest.mock('genkit', () => ({
  genkit: jest.fn(() => ({
    generate: jest.fn(() => Promise.resolve({ text: 'AI response' })),
  })),
}));

import { chatWithPdf } from '../../../../backend/functions/src/pdfChatService';
import { Buffer } from 'buffer';

describe('chatWithPdf', () => {
  it('should extract text from a simple PDF and call the AI model', async () => {
    const fakePdfBuffer = Buffer.from('fake-pdf-content');
    const prompt = 'Summarize this document.';

    const result = await chatWithPdf(fakePdfBuffer, prompt);
    expect(result).toBe('AI response');
  });
});
