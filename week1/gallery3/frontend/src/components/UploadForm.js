// UploadForm.js

import './UploadForm.css';
import React, { useState } from 'react';
import axios from 'axios';

function UploadForm({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');

  const handleFiles = (e) => {
    setFiles([...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    await axios.post('http://localhost:5000/photos/upload', formData);
    setFiles([]);
    onUpload();
  };

  const uploadUrl = async () => {
    if (!url) return;

    await axios.post('http://localhost:5000/photos/add-url', { url });
    setUrl('');
    onUpload();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        border: '2px dashed #aaa',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
      }}
    >
      <h3>📤 Upload Photos</h3>
      <input
        type="file"
        multiple
        onChange={handleFiles}
        style={{ margin: '10px 0' }}
      />
      <button onClick={uploadFiles} style={{ marginRight: '10px' }}>
        Upload Files
      </button>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="https://image-url.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '70%', marginRight: '10px' }}
        />
        <button onClick={uploadUrl}>Add from URL</button>
      </div>
    </div>
  );
}

export default UploadForm;
