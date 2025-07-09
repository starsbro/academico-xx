import { useRef, useState } from 'react';
// import toast from 'react-hot-toast';
// import { getIdToken } from '../../utils/getIdToken';
import { Paperclip, Send } from 'lucide-react';

export default function PdfChatUpload({
  onSubmitPdfChat,
  chatContainerRef,
}: {
  onSubmitPdfChat: (payload: { message: string; file?: File }) => void;
  chatContainerRef?: React.RefObject<HTMLDivElement>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return; // Prevent file change while loading
    setFile(e.target.files?.[0] || null);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const scrollToLatest = () => {
    if (chatContainerRef && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !message.trim()) return; // Prevent double submit
    setLoading(true);
    // 1. Optimistically show AI thinking placeholder only (handled by parent)
    await onSubmitPdfChat({ message, file });
    scrollToLatest();
    // Reset file input and state after send
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage(''); // Clear message after send
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white !border-2 !border-gray-200 focus-within:!border-blue-500 rounded-xl shadow-xl p-2 flex flex-col gap-2 my-3 !mb-6 transition-colors"
      style={{ boxSizing: 'border-box', position: 'sticky', bottom: 0, zIndex: 10 }}
    >
      {/* Upload button row */}
      <div className="flex items-center gap-2 mb-1">
        {/* Hidden file input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={loading}
          aria-label="Attach PDF"
        />
        <button
          type="button"
          onClick={handleUploadClick}
          className="p-2 rounded-full hover:bg-blue-50 border border-blue-200 bg-blue-100 text-blue-700 flex items-center gap-1 cursor-pointer"
          title={file ? file.name : 'Attach PDF'}
          disabled={loading}
        >
          <Paperclip size={20} />
          <span className="ml-1 text-lg font-medium">Add PDF...</span>
        </button>
        {file && <span className="text-lg text-blue-700 truncate max-w-[240px]">{file.name}</span>}
      </div>
      {/* Textarea and send button row */}
      <div className="flex items-end gap-2 w-full">
        <textarea
          className="flex-1 resize-none rounded-md border border-transparent px-3 py-2 text-sm shadow-none min-h-[40px] max-h-[120px] transition-all focus:outline-none focus:border-blue-500"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              if (!loading && message.trim()) {
                // Submit the form programmatically
                (e.target as HTMLTextAreaElement).form?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true })
                );
              }
            }
          }}
          placeholder="Type your message..."
          rows={1}
          disabled={loading}
          style={{ minHeight: 40, maxHeight: 120 }}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center disabled:bg-gray-300"
          style={{ height: 40, width: 40 }}
          title="Send"
        >
          {loading ? (
            <span className="loader border-t-2 border-white border-solid rounded-full w-5 h-5 block" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
}
