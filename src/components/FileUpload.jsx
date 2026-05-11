import { useRef, useState } from 'react';
import { uploadDocument } from '../services/uploadsService.js';

export function FileUpload() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setMessage('');

    const filePath = `${Date.now()}_${file.name}`;
    const { error } = await uploadDocument(filePath, file);

    if (error) {
      setStatus('error');
      setMessage(error.message ?? 'Upload failed.');
    } else {
      setStatus('success');
      setMessage(`"${file.name}" uploaded successfully.`);
    }

    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">Upload Document</label>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        disabled={status === 'uploading'}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 disabled:opacity-50"
      />
      {status === 'uploading' && (
        <p className="text-xs text-gray-400">Uploading…</p>
      )}
      {status === 'success' && (
        <p className="text-xs text-green-400">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-400">{message}</p>
      )}
    </div>
  );
}
