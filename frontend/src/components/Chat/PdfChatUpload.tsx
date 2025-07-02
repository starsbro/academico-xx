import { useState } from 'react';

export default function PdfChatUpload({ onResponse }: { onResponse: (msg: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file.');
    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('prompt', prompt);

    try {
      // Debug: log file and FormData contents
      console.log('DEBUG file:', file);
      for (const [key, value] of formData.entries()) {
        console.log(`DEBUG formData: ${key}`, value);
      }
      const apiUrl = process.env.NEXT_PUBLIC_PDF_CHAT_API_URL || '/api/chat-with-pdf';
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header manually when using FormData
      });
      let data;
      if (res.ok) {
        data = await res.json();
        onResponse(data.response || data.error || 'No response');
      } else {
        // Try to parse error as JSON, fallback to text
        try {
          data = await res.json();
          onResponse(data.error || 'Server error');
        } catch {
          const text = await res.text();
          onResponse(`Server error: ${text}`);
        }
      }
    } catch {
      onResponse('Network or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="text"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Enter your prompt"
        style={{ marginLeft: 8 }}
      />
      <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
        {loading ? 'Processing...' : 'Chat with PDF'}
      </button>
    </form>
  );
}
